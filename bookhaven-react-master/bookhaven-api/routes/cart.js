const express = require("express");
const router = express.Router();

// Import addToCart functions from cart-queries.js
const { addToCart } = require("../queries/cart-queries");

// Endpoint to add a book to the shopping cart
router.post("/addToCart", (req, res) => {
  const { user_id, book_id, quantity } = req.body;

  // Call the addToCart function to add the book to the cart
  addToCart(user_id, book_id, quantity, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to add item to cart" });
      return;
    }
    res.status(200).json({ message: result.message, cartData: result });
  });
});

// Import cart-related functions from cart-queries.js
const { viewBooksInCart } = require("../queries/cart-queries");

// Endpoint to get books in the shopping cart for a specific user
router.get("/viewBooksInCart/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  // Call the viewBooksInCart function to retrieve cart items with book details
  viewBooksInCart(user_id, (err, cartItems) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve cart items" });
    } else {
      res.status(200).json({ cartItems });
    }
  });
});

// Import the getCartItemCount function from cart-queries.js
const { getCartItemCount } = require("../queries/cart-queries");

// Endpoint to get the number of unique books in the shopping cart for a specific user
router.get("/getCartItemCount/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  // Call the getCartItemCount function to retrieve the count of unique books in the cart
  getCartItemCount(user_id, (err, uniqueBooksCount) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Failed to retrieve the number of unique books in cart",
      });
    } else {
      res.status(200).json(uniqueBooksCount);
    }
  });
});

// Import the function from cart-queries.js
const { updateBookQuantity } = require("../queries/cart-queries");

// Endpoint to update the quantity of a book in the shopping cart
router.put("/updateBookQuantity/:book_id", (req, res) => {
  const book_id = req.params.book_id;
  const user_id = req.body.userId;
  const adjustmentValue = req.body.adjustmentValue;

  updateBookQuantity(user_id, book_id, adjustmentValue, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to adjust item quantity" });
      return;
    }
    res.status(200).json({ message: result.message });
  });
});

// Import the deleteCartItem function from cart-queries.js
const { deleteBookInCart } = require("../queries/cart-queries");

// Endpoint to delete a book from the shopping cart
router.delete("/deleteBookInCart/:book_id", (req, res) => {
  const book_id = req.params.book_id;
  const user_id = req.body.userId;

  deleteBookInCart(user_id, book_id, (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      res.status(500).json({ error: "Failed to delete item from cart" });
      return;
    }

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Item not found in cart" });
      return;
    }

    res.status(200).json({ message: result.message });
  });
});

// Import the modified deleteBooksInCart function
const { deleteBooksInCart } = require("../queries/cart-queries");

// Endpoint to delete multiple books from the shopping cart
router.delete("/deleteBooksInCart", (req, res) => {
  const book_ids = req.body.bookIds; // Array of book IDs
  const user_id = req.body.userId;

  // Validate that book_ids is an array
  if (!Array.isArray(book_ids) || book_ids.length === 0) {
    res.status(400).json({ error: "No book IDs provided or invalid format" });
    return;
  }

  deleteBooksInCart(user_id, book_ids, (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      res.status(500).json({ error: "Failed to delete items from cart" });
      return;
    }

    // Check if any rows were affected
    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Items not found in cart" });
      return;
    }

    res.status(200).json({ message: result.message });
  });
});

module.exports = router;
