import { z } from 'zod';

// ============================================
// Base schemas
// ============================================
export const EmailSchema = z.string().email('Невалиден имейл адрес').max(254);
export const PasswordSchema = z
  .string()
  .min(8, 'Паролата трябва да е поне 8 символа')
  .max(128)
  .regex(/[A-Z]/, 'Паролата трябва да съдържа поне една главна буква')
  .regex(/[a-z]/, 'Паролата трябва да съдържа поне една малка буква')
  .regex(/[0-9]/, 'Паролата трябва да съдържа поне една цифра')
  .regex(/[^A-Za-z0-9]/, 'Паролата трябва да съдържа поне един специален символ');
export const UuidSchema = z.string().uuid();
export const IdSchema = z.string().min(1).max(64);

// ============================================
// AI Assistant
// ============================================
export const AIAssistantSchema = z.object({
  message: z.string().min(1, 'Съобщението е празно').max(500, 'Съобщението е твърде дълго (макс 500 символа)'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string().max(2000),
  })).max(20).optional().default([]),
  currentPage: z.string().max(200).optional().default(''),
  siteContext: z.string().max(2000).optional().default(''),
});

// ============================================
// Posts / Community
// ============================================
export const CreatePostSchema = z.object({
  type: z.enum(['win', 'question', 'workflow', 'prompt-share']),
  text: z.string().min(1, 'Напишете нещо').max(5000, 'Публикацията е твърде дълга'),
  tags: z.array(z.string().max(50)).max(10).optional().default([]),
});

export const UpdatePostSchema = z.object({
  text: z.string().min(1).max(5000).optional(),
  pinned: z.boolean().optional(),
});

export const PostIdParamSchema = z.object({
  postId: UuidSchema,
});

// ============================================
// Comments
// ============================================
export const CreateCommentSchema = z.object({
  postId: UuidSchema,
  text: z.string().min(1).max(2000),
});

export const CommentIdParamSchema = z.object({
  commentId: UuidSchema,
});

// ============================================
// Profile
// ============================================
export const UpdateProfileSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  bio: z.string().max(500).optional(),
  tools: z.array(z.string().max(50)).max(20).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  tc: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
});

// ============================================
// Lesson Progress
// ============================================
export const LessonProgressSchema = z.object({
  lessonId: z.string().min(1).max(64),
  completed: z.boolean(),
  notes: z.string().max(10000).optional(),
  xpEarned: z.number().int().min(0).max(1000).optional(),
});

// ============================================
// Saved Prompts
// ============================================
export const SavedPromptSchema = z.object({
  promptId: z.string().min(1).max(64),
});

// ============================================
// Coaching Request
// ============================================
export const CoachingRequestSchema = z.object({
  name: z.string().min(1).max(100),
  email: EmailSchema,
  goal: z.string().max(500).optional(),
  budget: z.string().max(100).optional(),
  message: z.string().max(2000).optional(),
});

// ============================================
// Contact Form
// ============================================
export const ContactFormSchema = z.object({
  name: z.string().min(1).max(100),
  email: EmailSchema,
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
});

// ============================================
// AI Tutor Feedback
// ============================================
export const AITutorFeedbackSchema = z.object({
  missionTitle: z.string().min(1).max(200),
  taskTitle: z.string().min(1).max(200),
  answer: z.string().min(1).max(10000),
});

// ============================================
// Admin actions
// ============================================
export const AdminUpdateUserSchema = z.object({
  userId: UuidSchema,
  role: z.enum(['user', 'admin']).optional(),
  plan: z.enum(['free', 'pro', 'premium']).optional(),
});

export const AdminDeleteUserSchema = z.object({
  userId: UuidSchema,
});
