# ADR-0001 — Tech Stack Selection

## Status
**Accepted** (2026-01-06)

## Date
2026-01-06

## Context
DOPE needs a tech stack that:
- Supports Telegram Mini App development
- Handles real-time WebSocket connections reliably
- Enables fast iteration with type safety
- Works well with TON blockchain integration

## Decision
We will use the following stack:

### Frontend (apps/web)
- **Framework:** React 18+ with Vite
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + CSS Modules
- **State:** Zustand (simple, no boilerplate)
- **Animations:** Framer Motion
- **Telegram SDK:** @twa-dev/sdk
- **TON Connect:** @tonconnect/ui-react

### Backend (apps/api)
- **Runtime:** Node.js 20+
- **Framework:** Fastify (fast, WS-friendly)
- **Language:** TypeScript
- **Validation:** Zod
- **WebSocket:** @fastify/websocket
- **ORM:** Drizzle ORM (type-safe, lightweight)

### Database
- **Primary:** PostgreSQL via **Neon** (serverless-native, DB branching for dev/staging)
- **Cache:** Redis (Upstash) for idempotency + rate limiting

### Infrastructure
- **Frontend Hosting:** Cloudflare Pages
- **Backend Hosting:** Fly.io (WS-friendly)
- **CI/CD:** GitHub Actions

### Monorepo
- **Package Manager:** pnpm
- **Workspace:** pnpm workspaces
- **Build:** Turborepo (optional)

## Consequences

### Pros
- Full TypeScript across the stack
- Zod schemas shared between frontend and backend
- Fastify has excellent WebSocket support
- Cloudflare Pages + Fly.io are cost-effective and reliable
- All tools have good DX and documentation

### Cons
- Team must know TypeScript well
- Fastify is less popular than Express (smaller ecosystem)
- Drizzle is newer than Prisma (less community resources)

## Alternatives Considered

### Option A: Next.js full-stack
- Description: Use Next.js for both frontend and API routes
- Why rejected: 
  - Vercel serverless has WebSocket limitations
  - Overkill for a Mini App
  - SSR not needed for this use case

### Option B: Bun runtime
- Description: Use Bun instead of Node.js
- Why rejected:
  - Less mature ecosystem
  - Deployment support still limited
  - Node.js is proven and stable

### Option C: Prisma ORM
- Description: Use Prisma instead of Drizzle
- Why rejected:
  - Heavier runtime
  - Drizzle is more lightweight and type-safe
  - Drizzle has simpler migrations

## References
- [Telegram Mini Apps Docs](https://core.telegram.org/bots/webapps)
- [TON Connect Docs](https://docs.ton.org/develop/dapps/ton-connect/overview)
- [Fastify Docs](https://www.fastify.io/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)

