# Decorly — Event Decorations Design Studio

Elegant editorial wedding-studio UI built with **React**, **JavaScript**, **Vite**, **Tailwind CSS**, and Supabase Auth. Account data (including designs and budget plans) syncs to Supabase; local demo mode remains available without Supabase credentials.

## Setup

```bash
cd decorly
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Supabase setup

1. Create a Supabase project and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to a local `.env` file (see `.env.example`). The legacy `VITE_SUPABASE_ANON_KEY` name is also supported.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor to create the private per-user data table and Row Level Security policies.
3. In Supabase Authentication, configure the allowed site and redirect URLs for your local and deployed app. Email confirmation can be enabled in the project’s auth settings.
4. Restart `npm run dev`. Users can create an account or sign in; their data is loaded and saved under their authenticated user ID.

Only the public anon key belongs in the browser. Never put a Supabase service role key in this app.

### Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start Vite dev server    |
| `npm run build`| Production build |
| `npm run preview` | Preview production build |

## Features

- **Design Studio** — layered canvas with flowers, backdrops, furniture, lighting, fabrics, and props; drag / resize / rotate; undo / redo; themes; venue floor-plan mode; PNG / JSON export; illustrative budget estimate
- **Guest share** — `/share/:id` read-only family view with comments and approve / request-changes (localStorage only)
- **Overview** — hero, recent designs, upcoming events, budget progress, popular flower combos
- **Explore Templates** — search, filters, favorites; open in Studio
- **My Designs / Moodboards / Budget / Decorators / Bookings / Settings** — working forms, validation, toasts, confirm dialogs, empty states; Studio → Decorators quote attaches design + estimate to the booking
- **EN / తెలుగు** language toggle in the header

Demo content is labelled **Demo data**. Estimates are labelled **Illustrative estimate**. No fake payments or fake AI.

## Project structure

```
src/
  components/   # layout, ui, studio
  context/      # App + toast providers
  data/         # themes, library, mock seeds
  hooks/        # undo/redo
  lib/          # storage, i18n, budget, utils
  pages/        # route screens
  types/        # shared app data helpers
```

Without Supabase credentials the app stays in local demo mode and persists to browser `localStorage`.

## Tech

- React 19 + React Router
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Fonts: Fraunces (display), Manrope (body)
- Icons: lucide-react
