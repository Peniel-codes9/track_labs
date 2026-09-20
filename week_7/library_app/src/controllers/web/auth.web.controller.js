const userService = require("../../services/user.service");

// Only ever trust ?next= as a path on this same site. An absolute URL
// (like https://evil.example.com) here would be an open redirect — sending
// a logged-in user somewhere else while looking like our own login flow.
function safeNextPath(next) {
  if (typeof next === "string" && next.startsWith("/") && !next.startsWith("//")) {
    return next;
  }
  return "/";
}

function showLogin(req, res) {
  res.render("pages/auth/login", { error: null, next: safeNextPath(req.query.next) });
}

async function login(req, res, next) {
  try {
    const user = await userService.findByEmailWithHash(req.body.email);
    const nextPath = safeNextPath(req.body.next);

    async function fail() {
      res.status(401).render("pages/auth/login", {
        error: "Invalid email or password",
        next: nextPath,
      });
    }

    if (!user) return fail();
    const matches = await user.comparePassword(req.body.password);
    if (!matches) return fail();

    req.session.regenerate(function (err) {
      if (err) return next(err);
      req.session.userId = user._id.toString();
      req.session.role = user.role;
      req.session.flash = { type: "success", text: "Welcome back, " + user.name + "." };
      res.redirect(nextPath);
    });
  } catch (err) {
    next(err);
  }
}

function showRegister(req, res) {
  res.render("pages/auth/register", { error: null, values: {} });
}

async function register(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    req.session.regenerate(function (err) {
      if (err) return next(err);
      req.session.userId = user._id.toString();
      req.session.role = user.role;
      req.session.flash = { type: "success", text: "Account created — welcome, " + user.name + "." };
      res.redirect("/");
    });
  } catch (err) {
    if (err.name === "ValidationError" || err.code === 11000) {
      const message = err.code === 11000 ? "That email is already registered." : "Please check the form and try again.";
      return res.status(400).render("pages/auth/register", { error: message, values: req.body });
    }
    next(err);
  }
}

function logout(req, res, next) {
  if (!req.session) return res.redirect("/");
  req.session.destroy(function (err) {
    if (err) return next(err);
    res.clearCookie("library.sid");
    res.redirect("/");
  });
}

module.exports = { showLogin, login, showRegister, register, logout };
