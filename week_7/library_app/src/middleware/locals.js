const crypto = require("crypto");

// Puts everything a template needs onto res.locals, so no view ever reads
// req.session directly — if sessions change shape later, only this file
// has to change, not every .ejs file.
function locals(req, res, next) {
  res.locals.currentUser = req.session && req.session.userId
    ? { id: req.session.userId, role: req.session.role }
    : null;

  // Issue a CSRF token into the session if one doesn't exist yet, so every
  // page (even a fresh visit) can render a form with a valid hidden field.
  if (req.session && !req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(24).toString("hex");
  }
  res.locals.csrfToken = req.session ? req.session.csrfToken : null;

  // One-time flash message: read it, then clear it immediately so it only
  // ever shows once, even if the user refreshes.
  res.locals.flash = (req.session && req.session.flash) || null;
  if (req.session) req.session.flash = null;

  next();
}

module.exports = locals;
