require("dotenv").config();

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error("Missing required environment variable: " + name);
  }
  return value;
}

const sessionSecret = required("SESSION_SECRET");
if (sessionSecret.length < 32) {
  throw new Error("SESSION_SECRET must be at least 32 characters long");
}

module.exports = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: required("MONGODB_URI"),
  SESSION_SECRET: sessionSecret,
  SESSION_TTL_MINUTES: Number(process.env.SESSION_TTL_MINUTES) || 60,
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS) || 12,
};
