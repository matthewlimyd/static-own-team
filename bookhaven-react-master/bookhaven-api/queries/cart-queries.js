const db = require("../dbConfig");

// Function to add a book to the shopping cart table in the database
const addToCart = (user_id, book_id, quantity, callback) => {
  const sql =
    "INSERT INTO shopping_cart (user_id, book_id, quantity) VALUES (?, ?, ?) " +
    "ON DUPLICATE KEY UPDATE quantity = quantity + 1";

  const values = [user_id, book_id, quantity];

  // Execute the SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      // Handle the database error by passing it to the callback
      callback(err);
    } else {
      callback(null, { message: "Item added to cart" });
    }
  });
};

// Function to get books in the shopping cart for a specific user
const viewBooksInCart = (user_id, callback) => {
  const sql =
    "SELECT sc.user_id, sc.book_id, sc.quantity, b.name, b.author, b.price, b.img_paths " +
    "FROM shopping_cart sc " +
    "INNER JOIN books b ON sc.book_id = b.book_id " +
    "WHERE sc.user_id = ?";

  const values = [user_id];

  // Execute the SQL query to retrieve items in the cart along with book details
  db.query(sql, values, (err, results) => {
    if (err) {
      // Handle the database error by passing it to the callback
      callback(err);
    } else {
      callback(null, results);
    }
  });
};

// Function to get the number of unique books in the shopping cart for a specific user
const getCartItemCount = (user_id, callback) => {
  const sql =
    "SELECT COUNT(*) AS uniqueBooksCount " +
    "FROM shopping_cart sc " +
    "WHERE sc.user_id = ?";

  const values = [user_id];

  // Execute the SQL query to retrieve the total number of unique books in the cart
  db.query(sql, values, (err, results) => {
    if (err) {
      // Handle the database error by passing it to the callback
      callback(err);
    } else {
      // Return the count of unique books in the cart by extracting it from the results
      const uniqueBooksCount = results[0].uniqueBooksCount;
      callback(null, uniqueBooksCount);
    }
  });
};

// Function to update the quantity of a book in the shopping cart
const updateBookQuantity = (user_id, book_id, adjustmentValue, callback) => {
  const sql =
    "UPDATE shopping_cart SET quantity = quantity + ? WHERE user_id = ? AND book_id = ?";

  const values = [adjustmentValue, user_id, book_id];

  db.query(sql, values, (err, result) => {
    if (err) {
      callback(err);
    } else if (result.affectedRows === 0) {
      callback(null, { message: "Item not found in cart" });
    } else {
      callback(null, {
        message: "Item quantity updated",
        affectedRows: result.affectedRows,
      });
    }
  });
};

// Function to delete a book from the shopping cart
const deleteBookInCart = (user_id, book_id, callback) => {
  const queryString = `
      DELETE FROM shopping_cart
      WHERE user_id = ? AND book_id = ?
    `;

  db.query(queryString, [user_id, book_id], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, {
        message: "Item deleted from cart",
        affectedRows: result.affectedRows,
      });
    }
  });
};

const deleteBooksInCart = (user_id, book_ids, callback) => {
  // Create placeholders for each book_id in the array
  const placeholders = book_ids.map(() => "?").join(", ");

  const queryString = `
    DELETE FROM shopping_cart
    WHERE user_id = ? AND book_id IN (${placeholders})
  `;

  const queryParameters = [user_id, ...book_ids];

  db.query(queryString, queryParameters, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, {
        message: "Items deleted from cart",
        affectedRows: result.affectedRows,
      });
    }
  });
};

module.exports = {
  addToCart,
  viewBooksInCart,
  getCartItemCount,
  updateBookQuantity,
  deleteBookInCart,
  deleteBooksInCart,
};
