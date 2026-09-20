const User = require("../models/user.model");

async function listUsers(req, res, next) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

async function changeRole(req, res, next) {
  try {
    const targetId = req.params.id;

    // A librarian changing their own role could accidentally (or
    // deliberately) demote themselves and lock every librarian out at once
    // if they were the last one — so it's blocked outright.
    if (targetId === req.user.id) {
      return res.status(409).json({
        error: { message: "You cannot change your own role" },
      });
    }

    const user = await User.findByIdAndUpdate(
      targetId,
      { role: req.body.role },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ error: { message: "User not found" } });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, changeRole };
