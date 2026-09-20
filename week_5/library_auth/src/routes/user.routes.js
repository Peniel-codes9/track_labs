const express = require("express");
const userController = require("../controllers/user.controller");
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");
const validate = require("../middleware/validate");
const { changeRoleSchema } = require("../validators/auth.validator");

const router = express.Router();

// authenticate first (who is this?), authorize second (are they allowed?),
// validate last — so an anonymous or wrong-role caller never even reaches
// the point of having their request body checked.
router.get("/", authenticate, authorize("librarian"), userController.listUsers);
router.patch(
  "/:id/role",
  authenticate,
  authorize("librarian"),
  validate(changeRoleSchema),
  userController.changeRole
);

module.exports = router;
