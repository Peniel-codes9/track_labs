# library-sessions — Lab 6: Sessions, Cookies & API Docs

Builds on Lab 5 by replacing the JWT with a server-side session, stored in
MongoDB and identified by a signed, HttpOnly cookie. Adds real logout,
session revocation, CSRF protection, and Swagger UI documentation.

## How to run

```
npm install
cp .env.example .env
# fill in MONGODB_URI and SESSION_SECRET (32+ random characters)
npm start
```

Node 18+. Same as Lab 5: the app refuses to start without a long enough
`SESSION_SECRET` — no default is provided.

## Env vars

- `MONGODB_URI` — required
- `SESSION_SECRET` — required, 32+ characters
- `SESSION_TTL_MINUTES` — optional, defaults to `60`
- `BCRYPT_ROUNDS` — optional, defaults to `12`
- `PORT` — optional, defaults to `3000`

## Cookie settings

| Setting | Value | Why |
|---|---|---|
| name | `library.sid` | default name would advertise the stack |
| httpOnly | true | JavaScript must never read the session id |
| secure | true only in production | comes from `NODE_ENV`, never hard-coded |
| sameSite | lax | blocks most cross-site sends, still allows normal link clicks |
| maxAge | from `SESSION_TTL_MINUTES` | must match the store's TTL, or one silently overrides the other |
| path | `/` | needed everywhere once Lab 7's UI exists |

## New endpoints

| Method | Path | Success | Failure |
|---|---|---|---|
| POST | /api/auth/login | 200, sets cookie | 401 |
| POST | /api/auth/logout | 204 (idempotent) | — |
| GET | /api/auth/sessions | 200 | 401 |
| DELETE | /api/auth/sessions/others | 204 | 401 |
| GET | /api/csrf-token | 200 | 401 |
| GET | /api-docs | 200 (Swagger UI) | — |
| GET | /api-docs.json | 200 (raw spec) | — |

Unsafe methods (POST/PATCH/DELETE) on cookie-authenticated routes need a
valid CSRF token in the `X-CSRF-Token` header, fetched from
`/api/csrf-token` first — otherwise 403.

## Known limitations

- No rate limiting on login.
- CSRF tokens live for the life of the session — no rotation per request.

## Questions

**1. Server session vs signed token — what's gained, what's it cost?**
A session gives you real logout and revocation, since the server can just
delete the record. The cost is a database lookup on every request and a
store you have to run and scale, instead of the token verifying itself.

**2. Session or token — mobile vs browser?**
Browser: session + cookie, since browsers manage cookies well and CSRF
defenses are mature. Mobile app: usually a token, since there's no cookie
jar or CSRF risk the same way, and the app can store the token itself.

**3. What happens to logged-in users when you rotate SESSION_SECRET?**
Every existing session cookie fails signature verification and everyone is
signed out at once. The safe way is to accept both the old and new secret
for a transition window, then drop the old one once existing sessions have
expired naturally.

**4. A librarian is demoted while logged in — what happens?**
Nothing, until they log out and back in — their session still has the old
`role` value, since we only store role at login, not re-check the database
per request. Fixing that would mean either re-reading the user from the DB
each request (costs a query every time) or actively invalidating that one
session when the role changes.

## Evidence

Fill in with real request/response pairs from your own run, including:
raw `Set-Cookie` header (password/secret redacted), the Atlas sessions
collection before/after logout, a tampered-cookie 401, a CSRF-missing 403
vs CSRF-valid 201, the full Lab 5 access matrix re-run with cookies instead
of a header, and two Swagger UI screenshots (login, then a librarian-only
create) — see the lab brief for the complete list.
