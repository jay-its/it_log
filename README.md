# IT Helpdesk Sign-In Kiosk

A Progressive Web App kiosk for tracking student IT helpdesk visits, built for
iPad in portrait mode. Students check in with their ID, name, and reason for
visit, and check out by ID lookup. Works offline and syncs automatically.

## Stack

- React 19 + Vite
- Tailwind CSS 4
- `vite-plugin-pwa` (manifest + service worker)
- Google Apps Script + Google Sheets as the backend

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (or the Codespaces forwarded port) on an iPad's
Safari browser, then **Share → Add to Home Screen** to install it as a
fullscreen kiosk app. Combine with iOS **Guided Access** (Settings >
Accessibility > Guided Access) to lock the iPad to this app.

## Backend setup (Google Apps Script)

1. Create a new Google Sheet. Add header row: `Date | Student ID | Student Name | Reason | Time In | Time Out`.
2. In the Sheet, go to **Extensions > Apps Script**.
3. Replace the default `Code.gs` contents with [`google-script/code.gs`](google-script/code.gs) from this repo.
4. **Deploy > New deployment > Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the deployment's `/exec` URL.
6. Either:
   - Copy `.env.example` to `.env` and set `VITE_APPS_SCRIPT_URL` to that URL, or
   - Leave it unset — the app will prompt for the URL on first launch and save it to the iPad's local storage.

## Deployment (GitHub Pages)

Pushes to `main` auto-deploy via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
to `https://<owner>.github.io/it_log/`. One-time setup (requires repo admin access):

1. **Settings → General → Danger Zone → Change visibility → Public.** GitHub
   Pages only serves private repos on paid plans, and nothing secret lives in
   this repo (the backend URL is entered on-device and stored in
   `localStorage`, never committed).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Push to `main` (or run the workflow manually from the Actions tab) — the
   site goes live at the URL above a minute or two later.

The kiosk won't have `VITE_APPS_SCRIPT_URL` baked in on this deployment (it's
intentionally not committed), so it'll show the on-screen "Connect to
Backend" prompt the first time it loads — paste the Apps Script `/exec` URL
there once and it's saved to that iPad's `localStorage`.

Deploying elsewhere (Netlify, Vercel, Cloudflare Pages, etc.), which serve
from the domain root instead of a `/it_log/` subpath? Build with
`BASE_PATH=/ npm run build`.

## Offline behavior

If the kiosk is offline (or the backend URL isn't configured yet), sign-ins
and sign-outs are queued in `localStorage` and automatically retried the next
time the device is back online — no submissions are lost.

## Project structure

```
src/
  components/   UI components (forms, header, status bar, overlays)
  hooks/        useOnlineStatus
  lib/api.js    Backend calls + offline queue
google-script/
  code.gs       Apps Script doPost handler (checkIn / checkOut)
```
