const db = require("../dbConfig");

const getBookFormats = (callback) => {
  const sql = "SELECT * FROM book_format";
  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

// Get List of Categories
const getBookCategories = (callback) => {
  const sql = "SELECT * FROM category";

  console.log(sql);

  db.query(sql, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

const getFilteredBooks = (filters, callback) => {
  let sql = "SELECT * FROM books WHERE 1=1";
  let values = [];

  if (
    filters.category &&
    Array.isArray(filters.category) &&
    filters.category.length > 0
  ) {
    const placeholders = filters.category.map(() => "?").join(",");
    sql += ` AND category_id IN (${placeholders})`;
    values.push(...filters.category.map((id) => parseInt(id)));
  }

  if (filters.bk_format_id) {
    sql += " AND bk_format_id = ?";
    values.push(parseInt(filters.bk_format_id));
  }

  if (filters.book_id) {
    sql += " AND book_id = ?";
    values.push(parseInt(filters.book_id));
  }

  if (filters.price_range) {
    const [minPrice, maxPrice] = filters.price_range.split("_").map(Number);
    sql += " AND price >= ? AND price <= ?";
    values.push(minPrice, maxPrice);
  }

  if (filters.minimum_rating) {
    sql += " AND rating >= ?";
    values.push(filters.minimum_rating);
  }

  if (filters.stock_yes) {
    sql += " AND quantity >0";
    values.push(filters.stock_yes);
  }

  if (filters.search) {
    sql += " AND name LIKE ?";
    values.push(`%${filters.search}%`);
  }

  if (filters.sort) {
    if (filters.sort === "asc") {
      sql += " ORDER BY price ASC";
    } else if (filters.sort === "desc") {
      sql += " ORDER BY price DESC";
    }
  }

  if (filters.limit) {
    sql += " LIMIT ?";
    values.push(parseInt(filters.limit));
  } else {
    sql += " LIMIT 100";
  }

  console.log(sql);

  db.query(sql, values, (err, results) => {
    if (err) return callback(err);

    if (results.length === 0) {
      console.log("no books found.");
      return callback(null, []);
    }
    callback(null, results);
  });
};

// Select Book by ID
const getBookDetailWithId = (book_id, callback) => {
  const sql = "SELECT * FROM books WHERE book_id = ?";
  db.query(sql, [parseInt(book_id)], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

module.exports = {
  getBookFormats,
  getBookCategories,
  getFilteredBooks,
  getBookDetailWithId,
};
