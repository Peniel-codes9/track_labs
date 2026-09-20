const express = require("express");
const bookRoutes = require("./book.routes");
const authRoutes = require("./auth.routes");
const userRoutes = require("./user.routes");

const router = express.Router();

router.use("/books", bookRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);

module.exports = router;
