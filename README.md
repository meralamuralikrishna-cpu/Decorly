# Decorly — Event Decorations Design Studio

Decorly is an event decoration design studio built with **React**, **JavaScript**, **Vite**, **Tailwind CSS**, and Supabase Auth. Designs, moodboards, and bookings sync to a signed-in user’s Supabase account. New workspaces start empty; editable starter layouts are provided for the canvas.

## Setup

```bash
cd decorly
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Supabase setup

1. Create a Supabase project and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to a local `.env` file (see `.env.example`). The legacy `VITE_SUPABASE_ANON_KEY` name is also supported.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor to create the private per-user data table, guest share table, and Row Level Security policies.
3. In Supabase Authentication, configure the allowed site and redirect URLs for your local and deployed app. Email confirmation can be enabled in the project’s auth settings.
4. Restart `npm run dev`. Users can create an account or sign in; their data is loaded and saved under their authenticated user ID.
5. To enable booking approvals, set the admin account's trusted `app_metadata` to `{ "role": "admin" }` in Supabase Auth, then have that user sign out and back in. The Booking approvals page is available only to admins; database row level security enforces the role for listing and deciding requests.

Only the public anon key belongs in the browser. Never put a Supabase service role key in this app.

### Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start Vite dev server    |
| `npm run build`| Production build |
| `npm run preview` | Preview production build |

## Features

- **Design Studio** — layered canvas with flowers, backdrops, furniture, lighting, fabrics, and props; drag / resize / rotate; undo / redo; themes; venue floor-plan mode; PNG / JSON export
- **Guest share** — `/share/:id` family view with comments and approve / request-changes, stored in Supabase
- **Overview** — recent designs, upcoming events, and palette ideas
- **Explore Templates** — search, filters, favorites; open in Studio
- **Bookings** — users submit requests; admins confirm or decline them from the protected Booking approvals page
- **My Designs / Moodboards / Decorators / Settings** — saved workspace records and empty states
- **EN / తెలుగు** language toggle in the header

Decorly does not ship a vendor directory, market pricing, or payment processing. Starter layouts are editable design examples, not real event records.

## Project structure

```
src/
  components/   # layout, ui, studio
  context/      # App + toast providers
  data/         # themes, design library, editable starter layouts
  hooks/        # undo/redo
  lib/          # Supabase client, i18n, utils
  pages/        # route screens
  types/        # shared app data helpers
```

Without Supabase credentials, sign-in and cloud persistence are unavailable; the optional offline workspace is temporary. User workspace records and guest shares are stored in Supabase; the Supabase client separately manages the auth session in the browser.

## Tech

- React 19 + React Router
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Fonts: Fraunces (display), Manrope (body)
- Icons: lucide-react
