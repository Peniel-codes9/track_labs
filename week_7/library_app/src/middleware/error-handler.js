// Every error in the app ends up here — JSON API requests and browser page
// requests both come through this one function. It picks the status code
// exactly the same way for both; only the representation differs.
function wantsJson(req) {
  return req.path.startsWith("/api");
}

function statusAndMessage(err) {
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(function (e) {
      return e.message;
    });
    return { status: 400, message: "Validation failed", details: messages };
  }

  if (err.name === "CastError") {
    return { status: 400, message: "Invalid " + err.path + ": " + err.value };
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return { status: 409, message: field + " already exists" };
  }

  // Errors thrown by the service layer carry their own status (400/404/409).
  if (err.status) {
    return { status: err.status, message: err.message };
  }

  return { status: 500, message: "Internal server error" };
}

function errorHandler(err, req, res, next) {
  const result = statusAndMessage(err);

  if (result.status === 500) {
    // Full detail stays server-side only — never in the response, JSON or HTML.
    console.error(err);
  }

  if (wantsJson(req)) {
    return res.status(result.status).json({
      error: { message: result.message, details: result.details },
    });
  }

  let template = "pages/errors/error"; // generic fallback for 400/409/etc.
  if (result.status === 404) template = "pages/errors/404";
  if (result.status === 403) template = "pages/errors/403";

  res.status(result.status).render(template, {
    status: result.status,
    message: result.message,
  });
}

module.exports = errorHandler;
