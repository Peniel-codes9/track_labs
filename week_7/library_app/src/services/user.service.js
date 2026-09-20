const User = require("../models/user.model");

async function findByEmailWithHash(email) {
  return User.findOne({ email: email }).select("+passwordHash");
}

async function findById(id) {
  return User.findById(id);
}

async function createUser(data) {
  const user = new User({
    name: data.name,
    email: data.email,
    passwordHash: data.password, // hashed by the model's pre-save hook
  });
  await user.save();
  return user;
}

async function listUsers() {
  return User.find();
}

async function changeRole(targetId, requesterId, role) {
  if (targetId === requesterId) {
    const err = new Error("You cannot change your own role");
    err.status = 409;
    throw err;
  }

  const user = await User.findByIdAndUpdate(targetId, { role: role }, { new: true, runValidators: true });
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  return user;
}

module.exports = { findByEmailWithHash, findById, createUser, listUsers, changeRole };
