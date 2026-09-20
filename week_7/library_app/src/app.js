const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const sessionMiddleware = require("./config/session");
const env = require("./config/env");
const apiRoutes = require("./routes");
const webRoutes = require("./routes/web");
const docsRoutes = require("./docs");
const locals = require("./middleware/locals");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

const app = express();

app.set("trust proxy", 1);

// Views are resolved with path.join so this works the same whether it's run
// from a terminal or inside a container with a different working directory.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layouts/main");
app.set("view cache", env.NODE_ENV === "production");

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // parses HTML form submissions
app.use(
  express.static(path.join(__dirname, "..", "public"), {
    maxAge: env.NODE_ENV === "production" ? "1d" : 0,
  })
);

app.use(sessionMiddleware);
app.use(locals);

app.get("/health", function (req, res) {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? "ok" : "unavailable",
    db: connected ? "connected" : "disconnected",
  });
});

app.use("/api", apiRoutes);
app.use(docsRoutes); // /api-docs and /api-docs.json
app.use("/", webRoutes); // page routes, mounted last so /api and /api-docs take priority

app.use(notFound);
app.use(errorHandler);

module.exports = app;
