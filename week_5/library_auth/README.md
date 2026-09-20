# library-auth — Lab 5: Authentication & Authorization

Builds on Lab 4's library API by adding users, password hashing, and JWT-based
login. Members can browse; only librarians can create, edit, or delete books.

## How to run

```
npm install
cp .env.example .env
# fill in MONGODB_URI and JWT_SECRET (32+ random characters, no default allowed)
npm start
```

Node 18+. The app refuses to start if `JWT_SECRET` is missing or under 32
characters — there's no fallback, since a guessable default secret is worse
than a crash.

## Env vars

- `MONGODB_URI` — required
- `JWT_SECRET` — required, 32+ characters
- `JWT_EXPIRES_IN` — optional, defaults to `1h`
- `BCRYPT_ROUNDS` — optional, defaults to `12`
- `PORT` — optional, defaults to `3001`

## Access matrix

| Method | Path | Anonymous | Member | Librarian |
|---|---|---|---|---|
| POST | /api/auth/register | 201 | 201 | 201 |
| POST | /api/auth/login | 200/401 | 200 | 200 |
| GET | /api/auth/me | 401 | 200 | 200 |
| GET | /api/books, /api/books/:id | 200 | 200 | 200 |
| POST | /api/books | 401 | 403 | 201 |
| PATCH/DELETE | /api/books/:id | 401 | 403 | 200/204 |
| GET | /api/users | 401 | 403 | 200 |
| PATCH | /api/users/:id/role | 401 | 403 | 200 |

Anonymous = no Authorization header. A bad/expired/malformed token is always
401, never 403 or 500.

## Known limitations

- No logout and no way to revoke a stolen token — a JWT is valid until it
  expires, no matter what. Lab 6 fixes this by moving to server-side sessions.
- No rate limiting on login.

## Questions

**1. Difference between 401 and 403, what should a client do?**
401 means "I don't know who you are" — the client should log in. 403 means
"I know who you are, but you're not allowed" — logging in again won't help;
that account just doesn't have permission.

**2. Why bcrypt over SHA-256?**
SHA-256 is built to be fast, which is exactly wrong for passwords — it makes
brute-forcing a stolen hash cheap. bcrypt is deliberately slow, and its cost
factor can be raised over time as hardware gets faster. The cost is real:
higher rounds means slower logins and more CPU per request.

**3. Trust the token's role claim, or re-check the database every request?**
This app trusts the role in the token. It's faster (no DB call on every
request) but means a role change doesn't take effect until the old token
expires. Re-checking the DB every request would reflect changes instantly
but adds a query to every single authenticated request.

**4. A token is stolen — what can you do?**
With this design: nothing until it expires — there's no way to revoke a
single token early. To do better, you'd need server-side state (a session,
or a token blocklist) — which is exactly what Lab 6 adds.

## Evidence

Fill in after running against your own Atlas cluster and pasting real
request/response pairs (see the lab brief for exactly which ones are
required — register, duplicate email, login success/failure pair, decoded
token payload, the three POST /api/books responses, tampered token, expired
token, /me).
