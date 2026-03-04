# eBay Community Moderation Tool — Deutschland

Quick reference guide for eBay Germany community moderators, with ready-to-use German message templates, shift timer, and admin notes.

## Features

- **Templates**: Remove post, edit post, lock/steer threads, CS redirect, guideline snippets (GG01–GG05, SG00–SG12)
- **Ban templates**: Fill ban period, reasoning, username, email, IP, spam URL, start date — copy internal + public reason
- **Admin notes**: Edited post and removed post note generators with link, violation, and copy
- **Shift timer**: Start/pause/resume with 45 min / 60 min visual cues
- **Shift notes**: Persistent notepad (localStorage)
- **Dark mode**: Toggle and persisted preference
- **Custom templates**: Edit any template and reset to default

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages

The app is built for the path `/eBayGermany/`. To avoid a white screen and 404 for `main.tsx`:

1. **Settings → Pages** in this repo.
2. Under **Build and deployment**, set **Source** to **"GitHub Actions"** (not "Deploy from a branch").
3. Push to `main`; the workflow will build and deploy. Then open:
   **https://ign-tunayilmaz.github.io/eBayGermany/**

If you see a 404 for `/src/main.tsx`, the site is being served from the source branch instead of the built artifact — set Source to **GitHub Actions** as above.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- lucide-react
