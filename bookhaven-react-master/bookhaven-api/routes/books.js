const express = require("express");
const router = express.Router();

// Endpoint to Get List of Book Formats
const { getBookFormats } = require("../queries/books-queries");

router.get("/formats", (req, res) => {
  getBookFormats((err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve data" });
      return;
    }
    res.json(results);
  });
});

// Endpoint to Get List of Categories
const { getBookCategories } = require("../queries/books-queries");

router.get("/categories", (req, res) => {
  getBookCategories((err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve categories" });
      return;
    }
    res.json(results);
  });
});

const { getFilteredBooks } = require("../queries/books-queries");

router.get("/books", (req, res) => {
  const filters = {
    category: req.query.category,
    format: req.query.format,
    price_range: req.query.price_range,
    minimum_rating: req.query.minimum_rating,
    stock_yes: req.query.stock_yes === "true",
    search: req.query.search,
    sort: req.query.sort,
  };

  getFilteredBooks(filters, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve books" });
      return;
    }
    res.json(results);
  });
});

// Endpoint to Get Book Detail with book_id
const { getBookDetailWithId } = require("../queries/books-queries");

router.get("/:book_id", (req, res) => {
  getBookDetailWithId(req.params.book_id, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve book details" });
      return;
    }
    res.json(results);
  });
});

module.exports = router;
