// Reads the Authorization header, verifies the token, and attaches a small
// req.user object. This is the ONLY file Lab 6 will need to change when
// authentication moves from a header to a session cookie — everything else
// (routes, controllers) just reads req.user and doesn't care where it came from.
const { verifyToken } = require("../utils/token");

function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: { message: "Missing or invalid Authorization header" } });
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    // Any failure here — bad signature, expired, malformed — is 401.
    // We never let a broken token fall through as "anonymous" or crash to 500.
    return res.status(401).json({ error: { message: "Invalid or expired token" } });
  }
}

module.exports = authenticate;
