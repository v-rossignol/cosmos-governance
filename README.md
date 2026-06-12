# Cosmos Governance

Administration client for the **Infinity** monorepo — dedicated admin sign-in and operational views.

## Quick start

From the monorepo root, start shared infrastructure first (databases, Infinity server, optional Caddy). Then:

```bash
cd cosmos-governance
npm install
npm run dev
```

| Mode | URL |
|------|-----|
| Vite dev server | http://localhost:3002/cosmos-governance/ |
| Via Caddy | http://localhost/cosmos-governance/ |

## Current scope

- Dedicated admin login (`/login`) using `/infinity/auth/*` endpoints
- Protected server health page (`/health`) calling `GET /infinity/health`

Admin role enforcement and full cookie-based auth depend on backend work tracked in [documentation/TO-BE-FIXED.md](../documentation/TO-BE-FIXED.md).

Agent guide: [AGENTS.md](AGENTS.md)
