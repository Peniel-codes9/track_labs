# library-app — Lab 7: Server-Rendered UI & Integration

Adds a browser-facing UI on top of the same API from Labs 4–6, sharing one
service layer so the JSON API and the HTML pages never duplicate a query.

## How to run

```
npm install
cp .env.example .env
# fill in MONGODB_URI and SESSION_SECRET (32+ characters)
npm start
```
Visit `http://localhost:3001` in a browser. Node 18+.

### With Docker

```
docker build -t library-app .
docker run -p 3000:3000 --env-file .env library-app
```

## Env vars

Same as Lab 6 — `MONGODB_URI`, `SESSION_SECRET` (32+ chars),
`SESSION_TTL_MINUTES`, `BCRYPT_ROUNDS`, `PORT`.

## What changed structurally

- `services/` — every Mongoose query, for both books and users, lives here now. Controllers (API and web) only call services.
- `controllers/` — the original JSON controllers, now thin, plus a new `controllers/web/` folder for page-rendering controllers.
- `views/` — EJS templates: one shared layout, partials for repeated bits (header, flash, pagination, the book form), and pages per route.
- `middleware/locals.js` — puts `currentUser`, `csrfToken`, and `flash` on every response so no view touches `req.session` directly.
- `middleware/web-auth.js` — the browser version of "must be logged in" / "must be a librarian": redirects instead of returning JSON.

## Page routes

| Method | Path | Access |
|---|---|---|
| GET | / | anyone |
| GET | /books/:id | anyone |
| GET | /books/new | librarian |
| POST | /books | librarian |
| GET | /books/:id/edit | librarian |
| POST | /books/:id | librarian |
| POST | /books/:id/delete | librarian |
| GET, POST | /login | anyone |
| GET, POST | /register | anyone |
| POST | /logout | anyone |

Anonymous hitting a librarian-only page redirects to `/login?next=...`. A
logged-in member hitting the same page gets a rendered 403, not a redirect
loop.

## Known limitations

- No image uploads — books are text data only.
- Pagination is page-number based, no infinite scroll.
- Flash messages are plain text, no icons.

## Questions

**1. Why does the controller decide the status code, not the service?**
The service doesn't know if it's being called by a JSON API or a page
render — it just does the data operation and throws on failure. Only the
controller knows what kind of response is expected, so only it should map
outcomes to `res.status()` and `res.json()`/`res.render()`.

**2. Why can a service function's return value differ from what the API
route sends back?**
`bookService.listBooks()` returns books, page number, and total count. The
JSON API only sends the books array back (task-required shape); the web
page uses all three fields to render the pagination bar. Same service call,
different slice of the result used by each controller.

**3. Why does POST /books/:id/delete exist instead of a real DELETE
request from a link?**
HTML forms can only send GET or POST — there's no native way to fire a
DELETE request from a plain link or form without JavaScript. Making delete
a link would also mean a browser prefetching links, or a crawler, could
trigger deletions just by visiting pages.

**4. Why is `?next=` restricted to a path on this site instead of trusting
whatever the client sends?**
An absolute URL there — `next=https://evil.example.com` — would make the
login page silently forward a real, logged-in session somewhere attacker
controlled right after a successful login. Restricting it to paths starting
with `/` (and rejecting `//`, which browsers treat as protocol-relative)
keeps the redirect confined to this app.

## Evidence

Fill in with real output from your own run: registering and logging in
through the browser, the CSRF-missing 403 (submit a form with the hidden
field stripped via dev tools), the redirect-then-403 sequence for a member
hitting a librarian page, a validation failure re-rendering the same form
with your input preserved, and a book title containing `<script>` rendering
as literal text on the page (view source, not just visually) — see the lab
brief for the complete list.
