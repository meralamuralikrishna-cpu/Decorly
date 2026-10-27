# Decorly — Event Decorations Design Studio

Elegant editorial wedding-studio UI built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. All data is local mock data persisted in `localStorage`. No API keys and no real backend.

## Setup

```bash
cd decorly
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Start Vite dev server    |
| `npm run build`| Typecheck + production build |
| `npm run preview` | Preview production build |

## Features

- **Design Studio** — layered canvas with flowers, backdrops, furniture, lighting, fabrics, and props; drag / resize / rotate; undo / redo; themes; illustrative budget estimate
- **Overview** — hero, recent designs, upcoming events, budget progress, popular flower combos
- **Explore Templates** — search, filters, favorites; open in Studio
- **My Designs / Moodboards / Budget / Decorators / Bookings / Settings** — working forms, validation, toasts, confirm dialogs, empty states
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
  types/        # shared TypeScript types
```

Designed so a future **Node / Express / PostgreSQL** API can replace `lib/storage.ts` without rewriting UI.

## Tech

- React 19 + React Router
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Fonts: Cormorant Garamond (headings), Inter (body)
- Icons: lucide-react
