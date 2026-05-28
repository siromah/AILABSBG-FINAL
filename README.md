# AILABSBG — AI Академия и Общност

Практична AI академия и общност за хора, които искат да използват AI в работа, бизнес и кариера — без шум, без празна теория и без технически жаргон.

**Стек:** React 19 + Vite + Tailwind CSS v4 + TypeScript + Supabase Auth

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
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Ако нямаш Supabase акаунт, можеш да го оставиш празно — приложението ще работи в "демо режим" с локален seed данни, но вход/регистрация няма да функционират.

---

## Build за продукция

```bash
npm run build
```

Резултатът отива в `dist/client` (статични файлове) + `dist/server.cjs` (Express сървър).

---

## Деплой на Vercel (препоръчително)

### Вариант 1: През GitHub (най-лесен)

1. Качи проекта в GitHub repo.
2. Отиди на [vercel.com](https://vercel.com) → **Add New Project**.
3. Импортирай repo-то.
4. В настройките на проекта:
   - **Framework Preset:** `Vite`
   - **Build Command:** остави `vite build` (или `npm run build`)
   - **Output Directory:** `dist/client`
5. Добави Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Натисни **Deploy**.

### Вариант 2: Vercel CLI

```bash
npm i -g vercel
vercel --prod
```

---

## Деплой на Netlify

1. Качи `dist/client` папката директно (Drag & Drop в Netlify UI).
2. Или свържи GitHub repo-то и задай:
   - **Build command:** `vite build`
   - **Publish directory:** `dist/client`

---

## Функционалности

- **Home** — Hero, екосистема, learning paths, prompts, events, pricing, FAQ
- **Академия** — Видео уроци, бележки, прогрес
- **Общност** — Дискусии, коментари, харесвания, запазвания
- **Prompt Library** — Търсене, филтри, копиране, запазване
- **Събития** — Workshops, записване
- **Цени** — Free / Pro / Premium
- **Профил** — Прогрес, запазени prompts, събития
- **Админ** — Таблица с потребители, публикации, събития
- **Тъмна/Светла тема** — Запазва се в localStorage, уважава системното предпочитание
- **AI Assistant** — Чат асистент за навигация (изисква backend endpoint)

---

## Структура на проекта

```
src/
  components/       # Nav, Footer, UI компоненти, AIAssistant
  contexts/         # AuthContext, ThemeContext
  lib/              # Supabase клиент
  pages/            # Всички страници
  data.ts           # Seed данни (prompts, уроци, събития, цени)
```

---

## Лиценз

Apache-2.0
