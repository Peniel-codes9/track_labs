const express = require("express");
const userController = require("../controllers/user.controller");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const csrfProtection = require("../middleware/csrf");
const validate = require("../middleware/validate");
const { changeRoleSchema } = require("../validators/auth.validator");

const router = express.Router();

router.get("/", authenticate, authorize("librarian"), userController.listUsers);
router.patch(
  "/:id/role",
  authenticate,
  csrfProtection,
  authorize("librarian"),
  validate(changeRoleSchema),
  userController.changeRole
);

module.exports = router;
