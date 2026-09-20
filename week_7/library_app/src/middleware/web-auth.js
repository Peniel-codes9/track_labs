// Web-page versions of "must be logged in" / "must be a librarian" — unlike
// the API middleware, these redirect a browser instead of returning JSON.

function requireLogin(req, res, next) {
  if (!req.session || !req.session.userId) {
    // ?next= lets us send the user back to the page they wanted after they
    // log in. We only ever treat it as a path on THIS site (see
    // auth.web.controller.js), never as a full URL — an absolute URL there
    // would be an open redirect.
    return res.redirect("/login?next=" + encodeURIComponent(req.originalUrl));
  }
  req.user = { id: req.session.userId, role: req.session.role };
  next();
}

function requireLibrarian(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.redirect("/login?next=" + encodeURIComponent(req.originalUrl));
  }
  if (req.session.role !== "librarian") {
    return res.status(403).render("pages/errors/403", {
      status: 403,
      message: "Librarians only",
    });
  }
  req.user = { id: req.session.userId, role: req.session.role };
  next();
}

function requireCsrf(req, res, next) {
  const submitted = req.body._csrf;
  if (!submitted || submitted !== req.session.csrfToken) {
    return res.status(403).render("pages/errors/403", {
      status: 403,
      message: "Your form session expired. Please try again.",
    });
  }
  next();
}

module.exports = { requireLogin, requireLibrarian, requireCsrf };
