// A factory, not a middleware itself: authorize('librarian') returns a
// middleware that checks req.user.role. This is the ONLY place a role name
// is compared against req.user — no controller ever does this check itself.
function authorize() {
  const allowedRoles = Array.prototype.slice.call(arguments);

  return function (req, res, next) {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: "You do not have permission to do this" } });
    }
    next();
  };
}

module.exports = authorize;
