// Every error in the app ends up here. This is the only place that decides
// what status code and message the client actually sees.
function errorHandler(err, req, res, next) {
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(function (e) {
      return e.message;
    });
    return res.status(400).json({ error: { message: "Validation failed", details: messages } });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ error: { message: "Invalid " + err.path + ": " + err.value } });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({ error: { message: field + " already exists" } });
  }

  console.error(err);
  res.status(500).json({ error: { message: "Internal server error" } });
}

module.exports = errorHandler;