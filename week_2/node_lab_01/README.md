# Lab 2 — Raw Node.js HTTP Server

A framework-free HTTP server built with only Node core modules (http, fs,
path, url). Serves two static pages, handles a form POST, and implements
manual routing, status codes, and a body-size limit.

## How to run

node --version   # should be 18 LTS or newer
npm install      # no-op, zero dependencies, but documents the standard flow
npm start
Server listens on http://localhost:3001.

Stop it with Ctrl+C — It shuts down cleanly via SIGINT.

## Env vars

None required for this lab.

## Endpoint table

| Method | Path              | Description                                      | Success | Errors                     |
|--------|-------------------|---------------------------------------------------|---------|-----------------------------|
| GET    | /               | Serves index.html (the create-user form)         | 200     | 405 (wrong verb), 500 (read fails) |
| GET    | /users          | Serves users.html, with submitted users rendered in; supports ?sort=asc | 200 | 405, 500 |
| POST   | /create-user    | Reads username from form body, logs it, redirects to / | 302 | 405, 413 (body > 1MB) |
| GET    | /static/<file>  | Serves a file from /public (stretch goal)        | 200     | 403 (path traversal attempt), 404 (missing file), 405 |
| *      | anything else     | —                                                   | —       | 404 (text/plain)          |

## Manual verification 

Start the server with npm start first, then check each of these.
In the browser:
1. Go to http://localhost:3001/ — the form loads. (GET / works)
2. Click "View users" — the users page loads. (GET /users works)
3. Fill in the form and submit — you land back on /, and the terminal running the server prints New user submitted: yourname.
4. Submit again with the username left blank — you still land on /, but the terminal prints No username was provided instead.
5. Go to http://localhost:3001/blah — the page shows "Not Found". (404 works)

In the terminal (server must already be running in another window):

curl -i http://localhost:3001/nonsense
Look for 404 in the output.

curl -i -X POST http://localhost:3001/users
Look for 405.

curl -i --path-as-is http://localhost:3001/static/../server.js
Look for 403 — this proves the server won't serve files outside the project folder.

500 check (no terminal command needed):

1. Rename index.html to index.html.bak
2. Refresh http://localhost:3001/ in the browser — it should show an error page
3. Rename it back to index.html

Startup/shutdown check: confirm the terminal printed Server is running on http://localhost:3001 when you ran npm start, and printed Shutting down... when you pressed Ctrl+C.

## Known limitations

- Submitted usernames are kept in memory only and reset on restart (no database yet).
- No input validation beyond checking that the username isn't empty.
- /static/* sends every file back as plain text. It doesn't try to guess file types.

## README questions

**1. Why must the response be sent inside the end handler rather than after
req.on("data") returns?**

The data event can fire more than once. The body might arrive in several
small pieces instead of all at once. req.on("data", ...) just says "run
this every time a piece arrives," it doesn't wait for the whole body to show
up. So if we sent the response right after that line, we might send it
before all the pieces had even arrived, and the body would be incomplete.
The end event only fires once, after every piece has arrived. That's why
we wait until end to read the full body and send the response.

2. What specifically would Express replace in your code, file by file?
- The chain of if (pathName === "/") { ... } checks in server.js →
  Express lets you write this as app.get("/", handler),
  app.post("/create-user", handler), and so on, instead of one long
  if/else chain.
- The req.on("data") / req.on("end") part that builds up the form body →
  Express has a built-in piece called express.urlencoded() that does this
  for you and just hands you the result as req.body.
- The fs.readFile() calls that manually read index.html and users.html →
  Express has res.sendFile(), and a whole express.static() helper for
  serving a folder of files (like our /static folder), so we wouldn't need
  to write our own file-reading code.
- The 404/405 fallback at the bottom of the code →
  Express already sends a 404 by default when nothing matches, and lets you
  add your own error-handling function for anything like our 500 case.
- All the res.writeHead(status, { "Content-Type": ... }) lines →
  Express shortens these to something like res.status(code).send(...).
- The check that stops someone from reading files outside the public
  folder → express.static() already does this check internally, so we
  wouldn't need to write it ourselves.

Basically, Express doesn't remove any of these ideas (routing, reading the
body, sending files, status codes) — it just gives you a shorter, already
-tested way to do each one instead of writing it by hand.
