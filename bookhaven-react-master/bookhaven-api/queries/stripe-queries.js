const db = require("../dbConfig");
// Function to add an order to the "order" table in the database
const addOrder = (user_id, payment_status, stripe_id, callback) => {
  const sql =
    "INSERT INTO `order` (user_id, payment_status, stripe_id, date) " +
    "VALUES (?, ?, ?, CURRENT_TIMESTAMP)";

  const values = [user_id, payment_status, stripe_id];

  // Execute the SQL query and retrieve the last inserted ID
  db.query(sql, values, (err, result) => {
    if (err) {
      // Handle the database error by passing it to the callback
      callback(err);
    } else {
      const order_id = result.insertId; // Retrieve the last inserted ID
      callback(null, { message: "Order added successfully", orderId: order_id });
    }
  });
};

const addOrderBook = (order_id, book_id, quantity, callback) => {
  const sql = "INSERT INTO order_books (order_id, book_id, quantity) VALUES (?, ?, ?)";

  const values = [order_id, book_id, quantity];

  // Execute the SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      // Handle the database error by passing it to the callback
      callback(err);
    } else {
      callback(null, { message: "Book added to order" });
    }
  });
};

// Function to retrieve the latest Stripe Checkout Session ID for a user
const getLatestSessionID = (user_id, callback) => {
  const sql = `SELECT stripe_id FROM \`order\` WHERE user_id = ? ORDER BY date DESC LIMIT 1;`;

  const values = [user_id];

  db.query(sql, values, (err, results) => {
    if (err) {
      // Handle the database error by passing it to the callback
      callback(err, null);
    } else if (results.length > 0) {
      // If there are results, retrieve the latest session ID
      const latestSessionID = results[0].stripe_id;
      callback(null, latestSessionID);
    } else {
      // No matching records found
      callback(null, null);
    }
  });
};

// Function to update payment status based on user ID and Stripe ID
const updatePaymentStatus = (user_id, stripe_id, updatePayment, callback) => {
  const sql = `
    UPDATE \`order\`
    SET payment_status = ?
    WHERE user_id = ? AND stripe_id = ?;
  `;
  const values = [updatePayment, user_id, stripe_id,];
  db.query(sql, values, (err, result) => {
    if (err) {
      // Handle the database error by passing it to the callback
      callback(err);
    } else {
      callback(null, { message: "Payment status updated successfully" });
    }
  });
};

const deleteOrderByStripeID = (stripe_id, callback) => {
  const sql = "UPDATE `order` SET stripe_id = NULL WHERE stripe_id = ?";

  const values = [stripe_id];

  // Execute the SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      // Handle the database error by passing it to the callback
      callback(err);
    } else {
      if (result.affectedRows > 0) {
        // If one or more rows were deleted, consider it a success
        callback(null, { message: "Order deleted successfully" });
      } else {
        // No matching records found
        callback(null, { message: "No order found with the provided Stripe ID" });
      }
    }
  });
};

module.exports = {
  addOrder,
  addOrderBook,
  getLatestSessionID,
  updatePaymentStatus,
  deleteOrderByStripeID,
};