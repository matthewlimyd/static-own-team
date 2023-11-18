const db = require("../dbConfig");

// Function to add user details of registered users to the database
const registerUser = (username, first_name, last_name, email, password, address, callback) => {
  // SQL query to insert the user details into the user table
  const sql = "INSERT INTO user (username, first_name, last_name, email, password, address, otp_secret_key) VALUES (?, ?, ?, ?, ?, ?, '')";
  const values = [username, first_name, last_name, email, password, address];

  // Execute the SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      // Handle the database error by passing it to the callback
      callback(err);
    } else {
      callback(null, { message: "Successfully registered" });
    }
  });
};

const getUserCreds = (username, callback) => {
  const sql = "SELECT password FROM user WHERE username = ?";
  db.query(sql, [username], (err, results, fields) => {
    if (err) {
      callback(err);
    } else if (results.length === 0) {
      callback(null, { message: "Username not found" });
    } else {
      callback(null, results[0].password);
    }
  });
};

const getUserID = (username, callback) => {
  const sql = "SELECT user_id, username, first_name, last_name, email, address FROM user WHERE username = ?";
  db.query(sql, [username], (err, results, fields) => {
    if (err) {
      callback(err);
    } else {
      callback(null, results[0]);
    }
  });
};

module.exports = {
  registerUser,
  getUserCreds,
  getUserID,
};
