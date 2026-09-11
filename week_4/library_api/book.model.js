const mongoose = require("mongoose");

const GENRES = [
  "fiction",
  "non-fiction",
  "sci-fi",
  "fantasy",
  "biography",
  "history",
  "poetry",
  "other",
];

const currentYear = new Date().getFullYear();

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 1, maxlength: 200 },
    author: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, trim: true, unique: true },
    genre: { type: String, enum: GENRES },
    publishedYear: { type: Number, required: true, min: 1450, max: currentYear },
    copiesTotal: { type: Number, required: true, min: 1, default: 1 },
    copiesAvailable: { type: Number, min: 0 },
  },
  { timestamps: true }
);

// Runs before every save/create. Two jobs:
// 1. If nobody set copiesAvailable yet, start it equal to copiesTotal.
// 2. Never let copiesAvailable be more than copiesTotal.
bookSchema.pre("validate", function (next) {
  if (this.isNew && this.copiesAvailable === undefined) {
    this.copiesAvailable = this.copiesTotal;
  }

  if (this.copiesAvailable > this.copiesTotal) {
    this.invalidate("copiesAvailable", "copiesAvailable cannot be more than copiesTotal");
  }

  next();
});

const Book = mongoose.model("Book", bookSchema);
Book.GENRES = GENRES;

module.exports = Book;