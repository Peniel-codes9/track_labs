const User = require("../models/user.model");
const { signToken } = require("../utils/token");

async function register(req, res, next) {
  try {
    // req.body.role is never read here — even if a client sends
    // "role": "librarian", it's ignored. Every new account starts as "member".
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: req.body.password, // gets hashed by the pre-save hook
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    next(err); // duplicate email -> error-handler.js turns E11000 into 409
  }
}

async function login(req, res, next) {
  try {
    // .select("+passwordHash") because the schema marks it select:false —
    // we have to explicitly ask for it here, and nowhere else.
    const user = await User.findOne({ email: req.body.email }).select("+passwordHash");

    // Deliberately the same response whether the email doesn't exist or the
    // password is wrong. Different messages would let an attacker figure out
    // which emails are registered (user enumeration).
    const invalidCredentials = () =>
      res.status(401).json({ error: { message: "Invalid email or password" } });

    if (!user) return invalidCredentials();

    const passwordMatches = await user.comparePassword(req.body.password);
    if (!passwordMatches) return invalidCredentials();

    const token = signToken(user);
    res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
}

async function me(req, res, next) {
  try {
    // req.user.id comes only from the verified token — never from a query
    // param or body, so a caller can't ask to see someone else's profile.
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ error: { message: "User no longer exists" } });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, me };
