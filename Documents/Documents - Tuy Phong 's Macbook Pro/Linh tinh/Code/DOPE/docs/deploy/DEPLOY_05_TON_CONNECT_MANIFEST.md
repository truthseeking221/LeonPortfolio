# DEPLOY_05_TON_CONNECT_MANIFEST — tonconnect-manifest.json (Required for Track A)

## Summary
TON Connect wallets fetch a manifest JSON from your site to display your dApp identity and configure connection UX.
It should be named `tonconnect-manifest.json`, served at `https://<YOUR_APP_URL>/tonconnect-manifest.json`, and accessible via direct GET.

---

## A) Create the manifest file
Create:
- `apps/web/public/tonconnect-manifest.json`

Example fields:
```json
{
  "url": "https://dope.example",
  "name": "DOPE",
  "iconUrl": "https://dope.example/icon.png",
  "termsOfUseUrl": "https://dope.example/terms",
  "privacyPolicyUrl": "https://dope.example/privacy"
}
```

Rules:
- `url` MUST match your deployed web origin.
- `iconUrl` MUST be HTTPS and publicly reachable.
- Keep terms and privacy pages live (even if simple).

---

## B) Hosting requirements (strict)
The manifest must be reachable via direct GET and authorization or intermediate proxy challenges can break connections.

Operational interpretation:
- Do NOT require auth headers/cookies.
- Do NOT put the file behind bot protection / "challenge pages".
- Ensure a plain 200 response with JSON body.

Many teams still use CDNs; the key is: no access challenges and direct fetch works.

---

## C) Caching
- Set a short cache (e.g., 5–15 minutes) so updates propagate.
- Avoid long immutable caching.

---

## D) Verification
From your laptop:
```bash
curl -i https://dope.example/tonconnect-manifest.json
```

Expect:
- 200 OK
- Content-Type: application/json (or compatible)
- valid JSON

---

## E) Frontend wiring
When using TON Connect UI, you pass manifestUrl pointing to this file.

Example:
```typescript
manifestUrl="https://dope.example/tonconnect-manifest.json"
```

---

## F) Done when
- [ ] Staging manifest reachable via HTTPS direct GET
- [ ] Prod manifest reachable via HTTPS direct GET
- [ ] Wallet connect modal shows correct app name + icon

