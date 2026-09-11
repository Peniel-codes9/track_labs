# library-api — Lab 4: Express MVC Library API

Stores books in MongoDB Atlas. No auth, no UI. The point of this lab is
keeping routes, controllers, and the model separate.

## How to run

npm install
cp .env.example .env
# fill in MONGODB_URI in .env
npm start
Node 18+. You should see "MongoDB connected" printed before "listening on
port 3001". The server won't open the port until the database is actually
connected.

## Env vars

- MONGODB_URI — required, your Atlas connection string
- PORT — optional, defaults to 3001

## What goes where

- routes/ — just verb + path + which controller to call. No database code.
- controllers/ — reads the request, calls the model, sends back a status code. No validation rules.
- models/ — the schema and its rules. Never touches req or res.
- middleware/ — checks that run before/after a controller (validation, 404s, errors).

## Endpoints

| Method | Path | Success | Failure |
|---|---|---|---|
| GET | /health | 200 | 503 |
| POST | /api/books | 201 | 400, 409 |
| GET | /api/books | 200 | 400 |
| GET | /api/books/:id | 200 | 400, 404 |
| PATCH | /api/books/:id | 200 | 400, 404, 409 |
| DELETE | /api/books/:id | 204 | 400, 404 |

Errors all look like: { "error": { "message": "...", "details": [...] } }

## Why Joi

Its rules map 1:1 to the data table (required, min, max, enum), and it
rejects unknown fields by default; no extra config needed to stop a client
sneaking in fields we don't want.

## Known limitations

- No pagination — /api/books returns everything.
- No borrow/return endpoints yet — copiesAvailable only gets set once, at creation.

## Questions

1. What can the controller do that the model can't, and vice versa?
The controller reads req, picks a status code, and shapes the response. The model owns every data rule(required fields, ranges, the unique isbn) and never touches req/res.

2. Who owns "can't delete a book while copies are on loan"?
The model. It's the only layer every delete path(route, script, job) always passes through.

**3. Why refuse a client-supplied copiesAvailable on PATCH?**
It should ony change from real borrows/ returns, not client's say so, so it's left off the PATCH whitelist entirely.

## Evidence (fill in after running against your own Atlas cluster)

curl -i -X POST http://localhost:3001/api/books -H "Content-Type: application/json" -d '{"title":"Things Fall Apart","author":"Chinua Achebe","isbn":"9780385474542","genre":"fiction","publishedYear":1958,"copiesTotal":3}'
201 + Location header:


curl -i -X POST http://localhost:3001/api/books -H "Content-Type: application/json" -d '{"author":"Chinua Achebe","isbn":"9780385474542","publishedYear":1958}'
400, missing title:


curl -i -X POST http://localhost:3001/api/books -H "Content-Type: application/json" -d '{"title":"Second Copy","author":"Someone","isbn":"9780385474542","publishedYear":2000}'
409, duplicate isbn:


curl -i "http://localhost:3001/api/books?author=Ama+Ata+Aidoo"
200, filtered list (seed 3+ books, 2+ authors first):


curl -i http://localhost:3001/api/books/64f000000000000000000000
404, valid but unused id:


curl -i http://localhost:3001/api/books/not-an-id
400, bad id format:


curl -i http://localhost:3001/api/books/<real-id>
curl -i -X PATCH http://localhost:3001/api/books/<real-id> -H "Content-Type: application/json" -d '{"publishedYear":1959}'
curl -i http://localhost:3001/api/books/<real-id>
Before / PATCH response / after — only publishedYear should change:
curl -i -X PATCH http://localhost:3001/api/books/<real-id> -H "Content-Type: application/json" -d '{"publishedYear":1200}'
400, validator ran on update:


curl -i -X DELETE http://localhost:3001/api/books/<real-id>
curl -i -X DELETE http://localhost:3001/api/books/<real-id>
204 then 404:


Forced 500 (describe how you triggered it, then paste the response. No
stack trace, no connection string)