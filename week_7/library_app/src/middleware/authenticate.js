// Rewritten for Lab 6: reads req.session instead of an Authorization header.
// Same 401 behaviour as Lab 5 — every route file and controller that uses
// req.user is completely unchanged.
function authenticate(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: { message: "Not logged in" } });
  }

  req.user = { id: req.session.userId, role: req.session.role };
  next();
}

module.exports = authenticate;
