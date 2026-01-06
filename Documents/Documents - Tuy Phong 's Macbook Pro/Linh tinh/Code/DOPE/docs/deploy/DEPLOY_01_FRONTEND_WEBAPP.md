# DEPLOY_01_FRONTEND_WEBAPP — Deploy the Telegram Mini App Web UI

## What this runbook covers
- Hosting the frontend over HTTPS
- SPA routing setup
- Local HTTPS for Telegram testing
- Telegram JS SDK inclusion requirements

---

## A) Default: Cloudflare Pages (recommended)

### A1) Preconditions
- `apps/web` builds as a static SPA (e.g., Vite dist)
- Build command produces `dist/` output

### A2) Create Projects
Create **two** Pages projects (avoid mixing staging/prod):
- `dope-web-staging` (deploy from branch `staging`)
- `dope-web-prod` (deploy from branch `main`)

### A3) Build settings
Example (adjust to your package manager):
- Build command: `pnpm -C apps/web build`
- Output directory: `apps/web/dist`

### A4) Environment variables (Pages)
Staging:
- `VITE_API_BASE_URL=https://api-staging.dope.example`
- `VITE_ENV=staging`

Prod:
- `VITE_API_BASE_URL=https://api.dope.example`
- `VITE_ENV=prod`

### A5) SPA routing (required)
Add a SPA fallback so Telegram deep links don't 404.

Create `apps/web/public/_redirects`:
```
/* /index.html 200
```

### A6) Telegram JS SDK loading (required)
In `apps/web/index.html`, load:
```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```
before your app bundle. Place this script in `<head>` before other scripts.

### A7) Verify from your laptop
```bash
curl -I https://staging.dope.example
```
Open in mobile Telegram: should render without blank screen

---

## B) Alternative: Vercel
Use Vercel if you prefer its DX. Keep staging/prod separated:
- Project dope-web-staging (staging branch)
- Project dope-web-prod (main branch)

Ensure:
- SPA fallback works (Vercel rewrites)
- env vars set per project

---

## C) Local HTTPS for Telegram (mandatory for realistic testing)
Telegram production environment allows only valid HTTPS links.

### C1) Option 1: Cloudflare Tunnel (recommended)
Start dev server:
```bash
pnpm -C apps/web dev --host 0.0.0.0 --port 5173
```
Run tunnel:
```bash
cloudflared tunnel --url http://localhost:5173
```
Use the HTTPS URL for BotFather menu button (staging bot).

### C2) Option 2: ngrok
```bash
ngrok http 5173
```
Use the HTTPS forwarding URL.

---

## D) Frontend "done when" checklist
- [ ] Staging web URL works over HTTPS
- [ ] Prod web URL works over HTTPS
- [ ] telegram-web-app.js loads before app code
- [ ] SPA fallback prevents 404 on refresh/deep links
- [ ] Web app reads VITE_API_BASE_URL correctly

