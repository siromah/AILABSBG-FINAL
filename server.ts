import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load env vars from .env.local first, then .env as fallback
dotenv.config({ path: '.env.local' });
dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

// Simple in-memory rate limiter for /api/ai-assistant
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10;
let cleanupCounter = 0;

function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  // Periodic cleanup of expired entries
  cleanupCounter++;
  if (cleanupCounter % 100 === 0) {
    for (const [key, entry] of rateLimitMap) {
      if (now > entry.resetTime) rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    res.status(429).json({ error: 'Too many requests. Please slow down.' });
    return;
  }

  entry.count += 1;
  next();
}

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '1mb' }));

  // CORS headers
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // API Route for AI Assistant
  app.post('/api/ai-assistant', rateLimitMiddleware, async (req: Request, res: Response) => {
    try {
      const { message, history, currentPage, siteContext } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required and must be a string.' });
      }

      if (message.length > 500) {
        return res.status(400).json({
          error: 'Въпросът е твърде дълъг. Опитай с по-кратко съобщение.'
        });
      }

      if (currentPage !== undefined && typeof currentPage !== 'string') {
        return res.status(400).json({ error: 'currentPage must be a string.' });
      }

      if (currentPage && currentPage.length > 200) {
        return res.status(400).json({ error: 'currentPage is too long.' });
      }

      if (siteContext !== undefined && typeof siteContext !== 'string') {
        return res.status(400).json({ error: 'siteContext must be a string.' });
      }

      if (siteContext && siteContext.length > 2000) {
        return res.status(400).json({ error: 'siteContext is too long.' });
      }

      const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;

      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey === 'your_api_key_here') {
        return res.status(503).json({
          error: 'В момента AI асистентът не е свързан с API ключ.'
        });
      }

      // Validate history
      if (history !== undefined && !Array.isArray(history)) {
        return res.status(400).json({ error: 'history must be an array.' });
      }

      const validatedHistory: Array<{ role: string; content: string }> = [];
      if (Array.isArray(history)) {
        for (const msg of history.slice(-6)) {
          if (
            msg &&
            typeof msg === 'object' &&
            typeof msg.role === 'string' &&
            typeof msg.content === 'string' &&
            msg.content.length <= 2000
          ) {
            validatedHistory.push({ role: msg.role, content: msg.content });
          }
        }
      }

      // Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `You are AI Навигатор, the helpful AI assistant inside AILABSBG — the first premium AI School and AI Community platform in Bulgaria. Your role is to help users understand the platform, choose where to start, learn how to use AI practically, navigate lessons, prompts, events, community features, and answer beginner-friendly questions about AI.

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
Current Page: ${currentPage || 'unknown'}
Site Context: ${siteContext || 'AILABSBG Platform'}
`;

      const aiHistory = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Разбрах. Аз съм AI Навигатор в AILABSBG. Как мога да помогна?' }] }
      ];

      for (const msg of validatedHistory) {
        aiHistory.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [...aiHistory, { role: 'user', parts: [{ text: message }] }],
        config: {
          temperature: 0.7,
        }
      });

      const answer = response.text;
      if (typeof answer !== 'string') {
        return res.status(500).json({
          error: 'Възникна проблем с AI отговора. Опитай отново след малко.'
        });
      }

      return res.json({ answer });
    } catch (error) {
      console.error('AI Error:', error);
      return res.status(500).json({
        error: 'Възникна проблем с AI отговора. Опитай отново след малко.'
      });
    }
  });

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist/client');
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
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // Graceful shutdown
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
