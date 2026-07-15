# ARISE

A mobile-first, offline-capable Progressive Web App for tracking a personal 90-day
fitness challenge — weight, BMI, workouts, and six daily missions. Built with React,
TypeScript, Material UI (Material Design 3), Framer Motion, and Recharts. All data is
stored locally in your browser's `localStorage` — there is no backend, no account, and
no external API calls. Nothing leaves your device.

## Getting started

Requires [Node.js](https://nodejs.org) 18+.

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`) on your phone or desktop
browser. On first launch you'll be asked to set up your challenge (name, height, current
and target weight, challenge length, calorie and protein goals) — this only happens once.

## Installing as an app (PWA)

Run a production build and preview it, then use your browser's "Add to Home Screen" /
"Install App" option:

```bash
npm run build
npm run preview
```

Once installed, ARISE works offline and behaves like a native app.

## Project structure

```
src/
  types.ts                 Data model shared across the app
  theme.ts                 Material Design 3 theme (color, shape, typography)
  context/AppDataContext.tsx   Single source of truth; reads/writes localStorage
  utils/
    dateUtils.ts            ISO date helpers
    calculations.ts         BMI, streaks, weight stats, challenge progress
    storage.ts               localStorage read/write + JSON export/import
  components/               Reusable UI pieces (checklist row, stat card, calendar grid, ...)
  pages/                    Dashboard, Workout, Progress, Settings
  App.tsx                   Bottom navigation shell + first-launch routing
  main.tsx                  Entry point, theme + service worker registration
```

## Data & privacy

Everything you enter — your profile, daily missions, workouts, and weight history — is
saved to `localStorage` under a single key (`arise_data_v1`). Use **Settings → Export
Data as JSON** to back it up, and **Import Data from JSON** to restore it (e.g. after
clearing your browser or moving to a new device). **Settings → Reset Challenge**
permanently deletes everything and returns you to the setup screen.
