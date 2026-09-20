// A cookie is sent by the browser automatically on every request — including
// ones a malicious page on another site triggers without the user knowing.
// This is what a bearer token in Lab 5 never needed, because nothing sends
// an Authorization header automatically.
//
// Defense: the client must also send the token back in a header (something
// automatic form/image/script tags on another site cannot do), and it must
// match the one stored on this session.
function csrfProtection(req, res, next) {
  const submittedToken = req.headers["x-csrf-token"];

  if (!submittedToken || submittedToken !== req.session.csrfToken) {
    return res.status(403).json({ error: { message: "Invalid or missing CSRF token" } });
  }

  next();
}

module.exports = csrfProtection;
