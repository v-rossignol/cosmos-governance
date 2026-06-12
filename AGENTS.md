# AGENTS.md — Cosmos Governance

Administration web client for **Infinity** (dedicated admin login, operational dashboards). React 18 + TypeScript + Vite SPA using the **Admin API** (`/infinity/admin/*`) with Bearer JWT auth.

**Monorepo context:** [../AGENTS.md](../AGENTS.md) · **Known gaps:** [../documentation/TO-BE-FIXED.md](../documentation/TO-BE-FIXED.md)

---

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server → http://localhost:3002/cosmos-governance/
npm run build        # Type-check (tsc) + production build → dist/
npm run preview      # Preview production build
npm run lint         # ESLint on .ts / .tsx
npm run test         # Vitest unit tests (tests/)
npm run test:watch   # Vitest watch mode
```

After changes, run `npm run test`, `npm run build`, and `npm run lint`.

**Local dev:** Start databases and the Infinity server first (see root [AGENTS.md](../AGENTS.md)). Vite proxies `/infinity/*` to `http://localhost:4000`. Optional: Caddy on port 80 for same-origin routing at `http://localhost/cosmos-governance/`.

---

## Project structure

```
src/
├── components/
│   ├── auth/            # Login, session bootstrap, route guard
│   ├── health/          # Server health panel
│   └── layout/          # Admin shell (header, sign out)
├── pages/               # Route-level wrappers
├── stores/              # Zustand (authStore)
├── services/            # api.ts, authService.ts, adminService.ts, healthService.ts
├── types/               # auth.ts, admin.ts, api.ts, health.ts
├── assets/
│   ├── theme.ts
│   └── styles/global.css
└── utils/               # helpers.ts
```

Path aliases: `@/`, `@components/`, `@pages/`, `@stores/`, `@services/`, `@types/`, `@utils/`.

---

## Implementation status

| Area | Client | Server |
|------|--------|--------|
| Admin login | `POST /infinity/auth/login` → Bearer token | Implemented |
| Session restore | `GET /infinity/admin/me` | Implemented |
| Logout | `POST /infinity/auth/logout` then clear token | Implemented |
| User list | `GET /infinity/admin/users` (service only) | Implemented |
| Statistics | `GET /infinity/admin/statistics` (service only) | Implemented |
| Server health | `GET /infinity/health` | Implemented |
| Admin role check | Enforced via `/infinity/admin/me` (403 for non-admin) | Implemented |

JWT is stored in **sessionStorage** for the current browser tab only. Do not use `localStorage`.

---

## Architecture rules

### Authentication

- Login via `POST /infinity/auth/login` returns `{ access_token }`; store in **sessionStorage** (`tokenStorage.ts`).
- Admin calls use `adminApi` (`baseURL: '/infinity/admin'`) with `Authorization: Bearer <token>`.
- Public operational calls use `infinityApi` (`baseURL: '/infinity'`), e.g. health.
- On app load, call `restoreSession()` → `GET /infinity/admin/me` when a token exists.
- Logout calls `POST /infinity/auth/logout` (with Bearer token), then clears sessionStorage.
- After successful login, navigate internally to `/health` (React Router — same SPA).
- Router `basename="/cosmos-governance"`.

### Layering

| Layer | Responsibility |
| ----- | -------------- |
| `pages/` | Route entry points only |
| `components/` | UI + feature logic |
| `stores/` | Auth state, loading, errors |
| `services/` | HTTP calls only — no UI logic |

### Forms

- **React Hook Form** + **Zod** schemas via `@hookform/resolvers/zod`.
- Surface API errors through `useAuthStore` and `getErrorMessage()` from `@utils/helpers`.

### UI

- **MUI v5** components and `sx` prop for styling.
- Dark theme in `src/assets/theme.ts` — extend there, don't hardcode one-off palette values.
- **Framer Motion** for layout transitions in `AuthLayout`.

---

## Document conventions

Shared monorepo standards: [../rules/documents.md](../rules/documents.md).

Do not create documentation files unless explicitly requested. Code, paths, and API identifiers are in **English**.

---

## Code style

- TypeScript strict mode — no `any` unless unavoidable; prefer explicit interfaces in `src/types/`.
- Named exports for components (`export const LoginForm`).
- Functional components and hooks only.
- Keep diffs minimal; match existing patterns before introducing new abstractions.
- UI copy and code identifiers are in **English**.

---

## API contract

Canonical reference: [../infinity/documentation/admin-api.md](../infinity/documentation/admin-api.md).

| Method | Route | Auth | Description |
| ------ | ----- | ---- | ------------- |
| POST | `/infinity/auth/login` | No | Obtain JWT |
| POST | `/infinity/auth/logout` | JWT | End session (`{ success: true }`) |
| GET | `/infinity/admin/me` | JWT + admin | Current admin profile |
| GET | `/infinity/admin/users` | JWT + admin | List users |
| GET | `/infinity/admin/statistics` | JWT + admin | Entity counts |
| GET | `/infinity/health` | No | Server health |

When adding or changing API calls, update the relevant service and keep types in `src/types/` aligned with server responses.

---

## Do not touch

| Path | Reason |
| ---- | ------ |
| `dist/` | Generated build output |
| `node_modules/` | Dependencies |
| `package-lock.json` | Only change when adding/removing dependencies |

Do not commit secrets (`.env`, credentials). Do not create git commits unless explicitly asked.

---

## Reference docs

- [../infinity/documentation/admin-api.md](../infinity/documentation/admin-api.md) — Admin HTTP contract (canonical for this client)
- [../infinity/documentation/infinity-api.md](../infinity/documentation/infinity-api.md) — Server API overview
- [../documentation/TO-BE-FIXED.md](../documentation/TO-BE-FIXED.md) — Cross-project deferred fixes
- [README.md](README.md) — Quick start

---

## Testing

Unit tests live in `tests/` and mirror `src/` layout. Stack: **Vitest** + **Testing Library** (jsdom).

| Layer | What to test |
| ----- | ------------ |
| `utils/` | Pure helpers (`getErrorMessage`, etc.) |
| `services/` | HTTP wrappers — mock `@/services/api` |
| `stores/` | Zustand actions — mock services |
| `components/` | Render behavior — mock or seed store state |

Reset `useAuthStore` state in `beforeEach` when testing auth-dependent UI.

## Definition of done

1. `npm run test` passes.
2. `npm run build` passes with no TypeScript errors.
3. `npm run lint` passes (or no new lint issues in touched files).
4. Auth uses Bearer JWT in sessionStorage per admin-api.md — no token in `localStorage`.
5. Protected routes redirect unauthenticated users to `/login`.
