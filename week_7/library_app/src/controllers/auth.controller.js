const crypto = require("crypto");
const userService = require("../services/user.service");
const sessionService = require("../services/session.service");

async function register(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const user = await userService.findByEmailWithHash(req.body.email);

    const invalidCredentials = () =>
      res.status(401).json({ error: { message: "Invalid email or password" } });

    if (!user) return invalidCredentials();

    const passwordMatches = await user.comparePassword(req.body.password);
    if (!passwordMatches) return invalidCredentials();

    req.session.regenerate(function (err) {
      if (err) return next(err);
      req.session.userId = user._id.toString();
      req.session.role = user.role;
      res.status(200).json({ user });
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  if (!req.session) return res.status(204).send();

  req.session.destroy(function (err) {
    if (err) return next(err);
    res.clearCookie("library.sid");
    res.status(204).send();
  });
}

async function me(req, res, next) {
  try {
    const user = await userService.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: { message: "User no longer exists" } });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

async function listSessions(req, res, next) {
  try {
    const sessions = await sessionService.listForUser(req.user.id, req.sessionID);
    res.status(200).json(sessions);
  } catch (err) {
    next(err);
  }
}

async function revokeOtherSessions(req, res, next) {
  try {
    await sessionService.revokeOthers(req.user.id, req.sessionID);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

function issueCsrfToken(req, res) {
  req.session.csrfToken = crypto.randomBytes(24).toString("hex");
  req.session.save(function (err) {
    if (err) return res.status(500).json({ error: { message: "Could not issue CSRF token" } });
    res.status(200).json({ csrfToken: req.session.csrfToken });
  });
}

module.exports = { register, login, logout, me, listSessions, revokeOtherSessions, issueCsrfToken };
