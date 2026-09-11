const express = require("express");
const bookController = require("../controllers/book.controller");
const validate = require("../middleware/validate");
const { createBookSchema, updateBookSchema } = require("../validators/book.validator");

const router = express.Router();

router.post("/", validate(createBookSchema), bookController.createBook);
router.get("/", bookController.listBooks);
router.get("/:id", bookController.getBook);
router.patch("/:id", validate(updateBookSchema), bookController.updateBook);
router.delete("/:id", bookController.deleteBook);

module.exports = router;
