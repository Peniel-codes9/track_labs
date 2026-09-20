const express = require("express");
const mongoose = require("mongoose");
const sessionMiddleware = require("./config/session");
const routes = require("./routes");
const docsRoutes = require("./docs");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

const app = express();

// Needed so secure cookies still work correctly when the app sits behind a
// load balancer / reverse proxy (common in real deployments). Set to 1
// (trust the first proxy) — setting this wrong in either direction breaks
// secure-cookie detection.
app.set("trust proxy", 1);

app.use(express.json());
app.use(sessionMiddleware);

app.get("/health", function (req, res) {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? "ok" : "unavailable",
    db: connected ? "connected" : "disconnected",
  });
});

app.use("/api", routes);
app.use(docsRoutes); // GET /api-docs and /api-docs.json

app.use(notFound);
app.use(errorHandler);

module.exports = app;
