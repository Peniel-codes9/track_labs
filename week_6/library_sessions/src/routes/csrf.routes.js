const express = require("express");
const authController = require("../controllers/auth.controller");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/csrf-token", authenticate, authController.issueCsrfToken);

module.exports = router;
