
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = 3001;
const publicDir = path.join(__dirname, "public");

let users = []; //an array that empties out everytime the server restarts

const server = http.createServer(function (req, res) {
  const parsedUrl = url.parse(req.url, true);
  const pathName = parsedUrl.pathname;
  const method = req.method;

  // Home page
  if (pathName === "/" && method === "GET") {
    fs.readFile(path.join(__dirname, "index.html"), function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Something went wrong reading the page");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
    return;
  }

  // Users page
  if (pathName === "/users" && method === "GET") {
    fs.readFile(path.join(__dirname, "users.html"), "utf8", function (err, data) {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Something went wrong reading the page");
        return;
      }

      // Users' list
      let extraUsers = "";
      for (let i = 0; i < users.length; i++) {
        extraUsers += "<li>" + users[i] + "</li>\n";
      }

      const finalPage = data.replace("<!--USERS_LIST-->", extraUsers);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(finalPage);
    });
    return;
  }

  // Handle the form submission
  if (pathName === "/create-user" && method === "POST") {
    let body = "";

    req.on("data", function (chunk) {
      body += chunk;

      // If someone sends way too much data, stop and reject it
      if (body.length > 1000000) {
        res.writeHead(413, { "Content-Type": "text/plain" });
        res.end("Payload Too Large");
        req.destroy();
      }
    });

    req.on("end", function () {
      const parsedBody = new URLSearchParams(body);
      const username = parsedBody.get("username");

      if (!username) {
        console.log("No username was provided");
      } else {
        console.log("New user submitted: " + username);
        users.push(username);
      }

      // Redirect back to the home page after submitting
      res.writeHead(302, { Location: "/" });
      res.end();
    });

    return;
  }

  if (pathName.indexOf("/static/") === 0 && method === "GET") {
    const requestedFile = pathName.replace("/static/", "");
    const filePath = path.join(publicDir, requestedFile);

    if (filePath.indexOf(publicDir) !== 0) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      res.end("Forbidden");
      return;
    }

    fs.readFile(filePath, function (err, data) {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(data);
    });
    return;
  }

  // If the path exists but the method is wrong
  if (pathName === "/" || pathName === "/users") {
    res.writeHead(405, { "Content-Type": "text/plain" });
    res.end("Method Not Allowed");
    return;
  }

  // Anything else we don't recognize
  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

server.listen(PORT, function () {
  console.log("Server is running on http://localhost:" + PORT);
});

// Shut down nicely when you press Ctrl+C
process.on("SIGINT", function () {
  console.log("Shutting down...");
  server.close(function () {
    process.exit(0);
  });
});