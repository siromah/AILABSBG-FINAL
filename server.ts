import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ZodError } from 'zod';
import {
  AIAssistantSchema,
  CreatePostSchema,
  UpdatePostSchema,
  PostIdParamSchema,
  CreateCommentSchema,
  CommentIdParamSchema,
  UpdateProfileSchema,
  LessonProgressSchema,
  SavedPromptSchema,
  CoachingRequestSchema,
  ContactFormSchema,
  AdminUpdateUserSchema,
  AdminDeleteUserSchema,
} from './src/lib/validation';

// Load env vars from .env.local first, then .env as fallback
dotenv.config({ path: '.env.local' });
dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// ============================================
// Supabase Admin Client (server-side ONLY)
// ============================================
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ============================================
// Types
// ============================================
interface AuthenticatedRequest extends Request {
  user?: { id: string; email?: string; role?: string };
}

// ============================================
// Rate Limiters
// ============================================
const createRateLimiter = (windowMs: number, max: number, keyPrefix: string) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      const uid = (req as AuthenticatedRequest).user?.id;
      return uid ? `${keyPrefix}:${uid}` : `${keyPrefix}:${req.ip || 'unknown'}`;
    },
    handler: (_req, res) => {
      res.status(429).json({ error: 'Too many requests. Please slow down.' });
    },
  });

// Stricter limits for auth endpoints
const authLimiter = createRateLimiter(15 * 60 * 1000, 5, 'auth');
const aiLimiter = createRateLimiter(60 * 1000, 10, 'ai');
const contactLimiter = createRateLimiter(60 * 60 * 1000, 3, 'contact');
const apiLimiter = createRateLimiter(60 * 1000, 60, 'api');

// ============================================
// Middleware: Verify Supabase Session
// ============================================
async function requireUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized. Please sign in.' });
    return;
  }

  const token = authHeader.slice(7);
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: 'Invalid or expired session.' });
    return;
  }

  // Fetch profile for role info
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('role, plan')
    .eq('id', data.user.id)
    .single();

  (req as AuthenticatedRequest).user = {
    id: data.user.id,
    email: data.user.email,
    role: profile?.role || 'user',
  };

  next();
}

// ============================================
// Middleware: Require Admin
// ============================================
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as AuthenticatedRequest).user;
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden. Admin access required.' });
    return;
  }
  next();
}

// ============================================
// Middleware: Validate Body
// ============================================
function validateBody(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const first = err.errors[0];
        res.status(400).json({ error: first?.message || 'Invalid input.' });
        return;
      }
      res.status(400).json({ error: 'Invalid input.' });
    }
  };
}

// ============================================
// Safe Error Response
// ============================================
function safeError(err: unknown): { error: string } {
  if (err instanceof Error) {
    return { error: err.message || 'An error occurred.' };
  }
  return { error: 'An unexpected error occurred.' };
}

// ============================================
// AI Usage Tracking
// ============================================
async function trackAIUsage(userId: string, tokens: number = 0) {
  const today = new Date().toISOString().slice(0, 10);
  const { data: existing } = await supabaseAdmin
    .from('ai_usage')
    .select('request_count')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (existing) {
    await supabaseAdmin
      .from('ai_usage')
      .update({
        request_count: existing.request_count + 1,
        total_tokens: (existing.total_tokens || 0) + tokens,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('date', today);
  } else {
    await supabaseAdmin.from('ai_usage').insert({
      user_id: userId,
      date: today,
      request_count: 1,
      total_tokens: tokens,
    });
  }
}

async function getAIUsageToday(userId: string): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabaseAdmin
    .from('ai_usage')
    .select('request_count')
    .eq('user_id', userId)
    .eq('date', today)
    .single();
  return data?.request_count || 0;
}

// ============================================
// Server
// ============================================
async function startServer() {
  const app = express();

  // Security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "https://*.supabase.co", "wss://*.supabase.co"],
        frameSrc: ["'self'", "https://www.youtube.com", "https://player.vimeo.com"],
      },
    },
    crossOriginEmbedderPolicy: false, // Required for iframe embeds
  }));

  app.disable('x-powered-by');

  // CORS - restrict in production
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000'];

  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  app.use(express.json({ limit: '1mb' }));

  // ============================================
  // Health Check
  // ============================================
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ============================================
  // AI Assistant (AUTHENTICATED + RATE LIMITED)
  // ============================================
  app.post('/api/ai-assistant', requireUser, aiLimiter, async (req: Request, res: Response) => {
    try {
      const body = AIAssistantSchema.parse(req.body);
      const user = (req as AuthenticatedRequest).user!;

      // Daily quota check
      const DAILY_AI_LIMIT = 50;
      const usageToday = await getAIUsageToday(user.id);
      if (usageToday >= DAILY_AI_LIMIT) {
        res.status(429).json({ error: 'Достигнахте дневния лимит за AI асистента. Опитайте отново утре.' });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'your_api_key_here') {
        res.status(503).json({ error: 'AI асистентът не е конфигуриран.' });
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `You are AI Навигатор, the helpful AI assistant inside AILABSBG — the first premium AI School and AI Community platform in Bulgaria.

Answer in Bulgarian by default. If the user writes in English, answer in English.

Be clear, practical, friendly, and direct. Keep answers concise but useful. Do not sound robotic. Do not overhype. Do not pretend to access private user data unless it is provided in the current conversation. Do not claim that a feature exists if it does not exist in the provided site context.

AILABSBG includes:
- Home: introduction to the AI School / AI Community
- Community: place for posts, discussions, AI creators, founders, learners, and questions
- Prompts: prompt library with reusable AI prompt templates
- Lessons: AI learning modules and 3-day AI intensive
- Events: workshops, webinars, and live AI sessions
- Profile: user profile, bio, tools, badges, saved content
- Admin: admin-only area for managing users, posts, events, and prompts

Your goal is to guide the user toward the most useful next action.

For beginners, suggest starting with Lessons, then Prompts, then Community.
For business users, suggest identifying one repetitive task and building an AI workflow around it.
For creators, suggest prompts for content, scripts, hooks, editing, and marketing.
For confused users, explain the platform simply.

Never give dangerous, illegal, or misleading advice.
If unsure, say so clearly and suggest the closest useful section of the platform.

Context:
Current Page: ${body.currentPage || 'unknown'}
Site Context: ${body.siteContext || 'AILABSBG Platform'}
`;

      const aiHistory = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Разбрах. Аз съм AI Навигатор в AILABSBG. Как мога да помогна?' }] }
      ];

      for (const msg of body.history.slice(-6)) {
        aiHistory.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [...aiHistory, { role: 'user', parts: [{ text: body.message }] }],
        config: { temperature: 0.7 },
      });

      const answer = response.text;
      if (typeof answer !== 'string') {
        res.status(500).json({ error: 'Възникна проблем с AI отговора.' });
        return;
      }

      await trackAIUsage(user.id);
      return res.json({ answer });
    } catch (error) {
      console.error('AI Error:', error);
      res.status(500).json(safeError(error));
    }
  });

  // ============================================
  // Contact Form (RATE LIMITED)
  // ============================================
  app.post('/api/contact', contactLimiter, validateBody(ContactFormSchema), async (req: Request, res: Response) => {
    try {
      const { name, email, subject, message } = req.body;
      // In production, send email via SendGrid/Resend/SES here
      console.log('[Contact]', { name, email, subject, message: message.slice(0, 200) });
      res.json({ success: true, message: 'Съобщението е изпратено успешно.' });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  // ============================================
  // Coaching Request (AUTHENTICATED)
  // ============================================
  app.post('/api/coaching', requireUser, apiLimiter, validateBody(CoachingRequestSchema), async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { name, email, goal, budget, message } = req.body;

      const { error } = await supabaseAdmin.from('coaching_requests').insert({
        user_id: user.id,
        name,
        email,
        goal,
        budget,
        message,
      });

      if (error) throw error;
      res.json({ success: true, message: 'Заявката е изпратена.' });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  // ============================================
  // Profile Routes
  // ============================================
  app.get('/api/profile/me', requireUser, async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      res.json({ profile: data });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  app.patch('/api/profile/me', requireUser, apiLimiter, validateBody(UpdateProfileSchema), async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ ...req.body, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  // ============================================
  // Posts (Community)
  // ============================================
  app.get('/api/posts', requireUser, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('posts')
        .select('*, profiles(full_name, initials), comments(id, text, created_at, profiles:user_id(full_name, initials)), post_likes(user_id), post_saves(user_id)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json({ posts: data });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  app.post('/api/posts', requireUser, apiLimiter, validateBody(CreatePostSchema), async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { type, text, tags } = req.body;

      const { data, error } = await supabaseAdmin
        .from('posts')
        .insert({ user_id: user.id, type, text, tags })
        .select()
        .single();

      if (error) throw error;
      res.json({ post: data });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  app.patch('/api/posts/:postId', requireUser, apiLimiter, async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { postId } = PostIdParamSchema.parse({ postId: req.params.postId });
      const updates = UpdatePostSchema.parse(req.body);

      // Check ownership or admin
      const { data: post } = await supabaseAdmin.from('posts').select('user_id').eq('id', postId).single();
      if (!post || (post.user_id !== user.id && user.role !== 'admin')) {
        res.status(403).json({ error: 'Forbidden.' });
        return;
      }

      const { data, error } = await supabaseAdmin
        .from('posts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;
      res.json({ post: data });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  app.delete('/api/posts/:postId', requireUser, apiLimiter, async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { postId } = PostIdParamSchema.parse({ postId: req.params.postId });

      const { data: post } = await supabaseAdmin.from('posts').select('user_id').eq('id', postId).single();
      if (!post || (post.user_id !== user.id && user.role !== 'admin')) {
        res.status(403).json({ error: 'Forbidden.' });
        return;
      }

      const { error } = await supabaseAdmin.from('posts').delete().eq('id', postId);
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  // ============================================
  // Comments
  // ============================================
  app.post('/api/comments', requireUser, apiLimiter, validateBody(CreateCommentSchema), async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { postId, text } = req.body;

      const { data, error } = await supabaseAdmin
        .from('comments')
        .insert({ post_id: postId, user_id: user.id, text })
        .select()
        .single();

      if (error) throw error;
      res.json({ comment: data });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  app.delete('/api/comments/:commentId', requireUser, apiLimiter, async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { commentId } = CommentIdParamSchema.parse({ commentId: req.params.commentId });

      const { data: comment } = await supabaseAdmin.from('comments').select('user_id').eq('id', commentId).single();
      if (!comment || (comment.user_id !== user.id && user.role !== 'admin')) {
        res.status(403).json({ error: 'Forbidden.' });
        return;
      }

      const { error } = await supabaseAdmin.from('comments').delete().eq('id', commentId);
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  // ============================================
  // Post Likes / Saves
  // ============================================
  app.post('/api/posts/:postId/like', requireUser, apiLimiter, async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { postId } = PostIdParamSchema.parse({ postId: req.params.postId });

      const { error } = await supabaseAdmin.from('post_likes').insert({ post_id: postId, user_id: user.id });
      if (error && !error.message.includes('duplicate')) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  app.delete('/api/posts/:postId/like', requireUser, apiLimiter, async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { postId } = PostIdParamSchema.parse({ postId: req.params.postId });

      const { error } = await supabaseAdmin.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  app.post('/api/posts/:postId/save', requireUser, apiLimiter, async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { postId } = PostIdParamSchema.parse({ postId: req.params.postId });

      const { error } = await supabaseAdmin.from('post_saves').insert({ post_id: postId, user_id: user.id });
      if (error && !error.message.includes('duplicate')) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  app.delete('/api/posts/:postId/save', requireUser, apiLimiter, async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { postId } = PostIdParamSchema.parse({ postId: req.params.postId });

      const { error } = await supabaseAdmin.from('post_saves').delete().eq('post_id', postId).eq('user_id', user.id);
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  // ============================================
  // Lesson Progress
  // ============================================
  app.get('/api/lessons/progress', requireUser, async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { data, error } = await supabaseAdmin
        .from('lesson_progress')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      res.json({ progress: data });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  app.post('/api/lessons/progress', requireUser, apiLimiter, validateBody(LessonProgressSchema), async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { lessonId, completed, notes, xpEarned } = req.body;

      const { error } = await supabaseAdmin
        .from('lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed,
          notes: notes || '',
          xp_earned: xpEarned || 0,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  // ============================================
  // Saved Prompts
  // ============================================
  app.get('/api/prompts/saved', requireUser, async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { data, error } = await supabaseAdmin
        .from('saved_prompts')
        .select('prompt_id')
        .eq('user_id', user.id);

      if (error) throw error;
      res.json({ saved: data?.map(d => d.prompt_id) || [] });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  app.post('/api/prompts/saved', requireUser, apiLimiter, validateBody(SavedPromptSchema), async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { promptId } = req.body;

      const { error } = await supabaseAdmin.from('saved_prompts').insert({ user_id: user.id, prompt_id: promptId });
      if (error && !error.message.includes('duplicate')) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  app.delete('/api/prompts/saved/:promptId', requireUser, apiLimiter, async (req: Request, res: Response) => {
    try {
      const user = (req as AuthenticatedRequest).user!;
      const { promptId } = SavedPromptSchema.parse({ promptId: req.params.promptId });

      const { error } = await supabaseAdmin
        .from('saved_prompts')
        .delete()
        .eq('user_id', user.id)
        .eq('prompt_id', promptId);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  // ============================================
  // Admin Routes
  // ============================================
  app.get('/api/admin/users', requireUser, requireAdmin, async (req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json({ users: data });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  app.patch('/api/admin/users', requireUser, requireAdmin, validateBody(AdminUpdateUserSchema), async (req: Request, res: Response) => {
    try {
      const { userId, role, plan } = req.body;

      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ role, plan, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  app.delete('/api/admin/users', requireUser, requireAdmin, validateBody(AdminDeleteUserSchema), async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;
      // Delete from auth.users (cascades to profiles via FK)
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
      if (error) throw error;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  app.get('/api/admin/coaching', requireUser, requireAdmin, async (_req: Request, res: Response) => {
    try {
      const { data, error } = await supabaseAdmin
        .from('coaching_requests')
        .select('*, profiles(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      res.json({ requests: data });
    } catch (error) {
      res.status(500).json(safeError(error));
    }
  });

  // ============================================
  // Vite / Static Serving
  // ============================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'build');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Not found' });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  });

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  const shutdown = () => {
    console.log('Shutting down server...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
