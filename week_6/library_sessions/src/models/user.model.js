const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const env = require("../config/env");

const ROLES = ["member", "librarian"];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    // select: false means a normal find/findById never returns this field —
    // you have to explicitly ask for it (see auth.controller.js login).
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ROLES, default: "member" },
  },
  { timestamps: true }
);

// Only re-hash the password when it's actually being set/changed. Without
// this check, saving a profile update (e.g. just the name) would re-hash
// the already-hashed value and lock the user out.
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, env.BCRYPT_ROUNDS);
  next();
});

userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

// Runs whenever a user document is turned into JSON (e.g. res.json(user)).
// This is the backstop for select:false — it also strips the hash out of
// .lean() results or anywhere someone spreads the raw document.
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);
User.ROLES = ROLES;

module.exports = User;
