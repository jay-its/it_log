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
