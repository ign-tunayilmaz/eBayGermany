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

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- lucide-react
