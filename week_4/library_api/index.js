const express = require("express");
const bookRoutes = require("./book.routes");

const router = express.Router();

router.use("/books", bookRoutes);

module.exports = router;
