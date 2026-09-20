const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("../models/user.model");

async function register(req, res, next) {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: req.body.password,
    });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const user = await User.findOne({ email: req.body.email }).select("+passwordHash");

    const invalidCredentials = () =>
      res.status(401).json({ error: { message: "Invalid email or password" } });

    if (!user) return invalidCredentials();

    const passwordMatches = await user.comparePassword(req.body.password);
    if (!passwordMatches) return invalidCredentials();

    // regenerate() gives us a brand new session id after login. Without this,
    // an attacker who got a victim to use a session id THEY chose (before
    // login) could hijack the now-authenticated session — session fixation.
    req.session.regenerate(function (err) {
      if (err) return next(err);

      // Only the id and role go on the session — never the whole user
      // document, so a role change elsewhere doesn't go stale until the
      // session naturally expires.
      req.session.userId = user._id.toString();
      req.session.role = user.role;

      res.status(200).json({ user }); // no token in the body — the cookie is the credential now
    });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  if (!req.session) {
    return res.status(204).send(); // already logged out — idempotent
  }

  req.session.destroy(function (err) {
    if (err) return next(err);
    res.clearCookie("library.sid");
    res.status(204).send();
  });
}

async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: { message: "User no longer exists" } });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

// Lists this user's own active sessions by querying the sessions collection
// directly — connect-mongo stores each session as its own document, with the
// data we put on req.session (including userId) nested under "session".
async function listSessions(req, res, next) {
  try {
    const collection = mongoose.connection.collection("sessions");
    const docs = await collection.find({ "session.userId": req.user.id }).toArray();

    const sessions = docs.map(function (doc) {
      return {
        id: doc._id,
        current: doc._id === req.sessionID,
        expires: doc.expires,
      };
    });

    res.status(200).json(sessions);
  } catch (err) {
    next(err);
  }
}

async function revokeOtherSessions(req, res, next) {
  try {
    const collection = mongoose.connection.collection("sessions");
    await collection.deleteMany({
      "session.userId": req.user.id,
      _id: { $ne: req.sessionID },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

function issueCsrfToken(req, res) {
  req.session.csrfToken = crypto.randomBytes(24).toString("hex");
  // Save explicitly before responding — otherwise a fast client could use
  // the token before the session write finishes.
  req.session.save(function (err) {
    if (err) return res.status(500).json({ error: { message: "Could not issue CSRF token" } });
    res.status(200).json({ csrfToken: req.session.csrfToken });
  });
}

module.exports = {
  register,
  login,
  logout,
  me,
  listSessions,
  revokeOtherSessions,
  issueCsrfToken,
};
