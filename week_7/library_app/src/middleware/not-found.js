function notFound(req, res) {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({
      error: { message: "Route not found: " + req.method + " " + req.originalUrl },
    });
  }

  res.status(404).render("pages/errors/404", { status: 404, message: "Page not found" });
}

module.exports = notFound;
