const userService = require("../services/user.service");

async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

async function changeRole(req, res, next) {
  try {
    const user = await userService.changeRole(req.params.id, req.user.id, req.body.role);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { listUsers, changeRole };
