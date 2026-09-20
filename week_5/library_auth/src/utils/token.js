// The only file allowed to import jsonwebtoken. Everyone else calls these
// two functions instead of touching the library directly.
const jwt = require("jsonwebtoken");
const env = require("../config/env");

function signToken(user) {
  // Payload carries only what's needed to identify and authorize the caller —
  // never anything sensitive like a password or hash.
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

function verifyToken(token) {
  // Throws if the signature is wrong, the token is expired, or it's malformed.
  // We never use jwt.decode() here — decode trusts the payload without
  // checking the signature, which means trusting whatever an attacker wrote.
  return jwt.verify(token, env.JWT_SECRET);
}

module.exports = { signToken, verifyToken };
