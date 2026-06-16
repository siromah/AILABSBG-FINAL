# AILABSBG — AI Академия и Общност

Практична AI академия и общност за хора, които искат да използват AI в работа, бизнес и кариера — без шум, без празна теория и без технически жаргон.

**Стек:** React 19 + Vite + Tailwind CSS v4 + TypeScript + Supabase Auth + Express

---

## Локално пускане

```bash
# 1. Инсталирай зависимостите
npm install

# 2. Създай .env файл в корена на проекта
# (виж по-долу кои променливи са нужни)

# 3. Стартирай dev сървъра
npm run dev
```

Приложението ще е достъпно на `http://localhost:3000`.

---

## Environment Variables

Създай файл `.env` в корена:

```env
# Supabase (frontend + backend)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Site URL (for auth redirects)
VITE_PUBLIC_SITE_URL=http://localhost:3000

# Backend AI (server-side only — NEVER expose to frontend)
GEMINI_API_KEY=

# Email (optional — needed for the contact form to actually send email)
RESEND_API_KEY=
CONTACT_EMAIL_FROM=AILABS.BG <noreply@ailabs.bg>
CONTACT_EMAIL_TO=hello@ailabs.bg

# Server
NODE_ENV=development
PORT=3000

# CORS (production — required when deploying the API separately)
# ALLOWED_ORIGINS=https://yourdomain.com,https://app.yourdomain.com
```

Ако нямаш Supabase акаунт, можеш да го оставиш празно — приложението ще работи в "демо режим", но вход/регистрация, общност, запазени prompts и прогрес няма да функционират.

---

## Build за продукция

```bash
npm run build
```

Резултатът отива в `build/` (статични файлове). Express сървърът може да се билдне с:

```bash
npm run build:server
```

---

## Деплой на GitHub Pages

Проектът включва GitHub Actions workflow (`.github/workflows/deploy.yml`), който автоматично деплойва `build/` папката на GitHub Pages при push в `main`.

1. Качи проекта в GitHub repo.
2. В Settings → Pages задай Source на "GitHub Actions".
3. Добави нужните Environment Variables като repository secrets (Repository Settings → Secrets and variables → Actions):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Пушни в `main`.

**Забележка:** GitHub Pages хоства само статичните файлове. Express API-то (contact form, AI tutor, coaching) няма да работи там. За пълна функционалност използвай Vercel, Render, Fly.io или подобна платформа.

---

## Деплой на Vercel (пълен backend + frontend)

### Вариант 1: През GitHub

1. Качи проекта в GitHub repo.
2. Отиди на [vercel.com](https://vercel.com) → **Add New Project**.
3. Импортирай repo-то.
4. В настройките на проекта:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`
5. Добави Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GEMINI_API_KEY`
   - `RESEND_API_KEY` (за contact form)
   - `ALLOWED_ORIGINS`
6. Натисни **Deploy**.

### Вариант 2: Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

---

## Деплой на Netlify

1. Свържи GitHub repo-то и задай:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
2. Добави същите Environment Variables като за Vercel.

---

## Функционалности

- **Home** — Hero, екосистема, learning paths, prompts, events, pricing, FAQ
- **Академия** — Видео уроци, бележки, прогрес
- **Мисии** — Gamified уроци с тестове, практически задачи, XP и стрийкове
- **Общност** — Дискусии, коментари, харесвания, запазвания
- **Prompt Library** — Търсене, филтри, копиране, запазване
- **Събития** — Workshops, записване
- **Цени** — Free / Pro / Premium
- **Профил** — Прогрес, запазени prompts, събития
- **Админ** — Таблица с потребители, публикации, събития
- **Тъмна/Светла тема** — Запазва се в localStorage, уважава системното предпочитание
- **AI Assistant** — Чат асистент за навигация
- **AI Tutor** — Обратна връзка за практически задачи

---

## Структура на проекта

```
src/
  components/       # Nav, Footer, UI компоненти, AIAssistant, Mission components
  contexts/         # AuthContext, ThemeContext
  hooks/            # Custom hooks (useMissionProgress)
  lib/              # Supabase клиент, validation, mission data
  pages/            # Всички страници
  data.ts           # Seed данни (prompts, уроци, събития, цени)
public/             # robots.txt, sitemap.xml
supabase/
  migrations/       # SQL схема и RLS policies
server.ts           # Express backend
```

---

## Сигурност

- Service role key и AI API keys се използват само в `server.ts`.
- Frontend използва само `VITE_SUPABASE_ANON_KEY`.
- RLS policies ограничават достъпа до данни.
- Admin API routes изискват аутентикация и admin роля.

---

## Лиценз

Apache-2.0
