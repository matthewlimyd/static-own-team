const db = require("../dbConfig");

const getOrdersForUser  = (user_id, callback) => {
  const sql = "SELECT ord.order_id, payment_status, date, books.name, books.price, ord_books.quantity, (books.price * ord_books.quantity) as total, user.address, user.email FROM bookhaven.order as ord, bookhaven.order_books as ord_books, bookhaven.books as books, bookhaven.user as user WHERE ord.order_id = ord_books.order_id AND ord_books.book_id = books.book_id AND user.user_id = ord.user_id AND ord.user_id = ?";
  db.query(sql, [user_id], (err, results,fields) => {
      if (err) {
          callback(err);
      }
      else {
          console.log("order for user results here");
      	  console.log(results);
          callback(null,results);
      }
      
  });
};

module.exports = {
	getOrdersForUser
};