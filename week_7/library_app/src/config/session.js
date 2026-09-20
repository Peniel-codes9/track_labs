// Every cookie option is set explicitly here, on purpose — no relying on
// express-session's defaults, and nothing hard-coded that should come from
// NODE_ENV. See the README for why each line is set the way it is.
const session = require("express-session");
const MongoStore = require("connect-mongo");
const env = require("./env");

module.exports = session({
  name: "library.sid", // not "connect.sid" — the default advertises the stack
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: env.MONGODB_URI,
    collectionName: "sessions",
    ttl: env.SESSION_TTL_MINUTES * 60, // connect-mongo wants seconds
    stringify: false, // store session data as a real subdocument, so we can query it (see auth.controller.js sessions list)
  }),
  cookie: {
    httpOnly: true, // JavaScript in the browser must never be able to read this
    secure: env.NODE_ENV === "production", // only over HTTPS in production, never hard-coded
    sameSite: "lax", // blocks most cross-site sends while still allowing normal link navigation
    maxAge: env.SESSION_TTL_MINUTES * 60 * 1000, // express wants milliseconds — must agree with the store's TTL above
    path: "/",
  },
});
