const db = require("../dbConfig");
const {
  addToCart,
  viewBooksInCart,
  getCartItemCount,
  updateBookQuantity,
  deleteBookInCart,
  deleteBooksInCart,
} = require("../queries/cart-queries");

jest.mock("../dbConfig");

describe("cart-queries", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test the addToCart function
  describe("addToCart", () => {
    it("should add a book to the cart", (done) => {
      const mockData = { message: "Item added to cart" };
      db.query.mockImplementation((sql, values, callback) => {
        callback(null, mockData);
      });

      addToCart(1, 100, 1, (err, results) => {
        expect(err).toBeNull();
        expect(results).toEqual(mockData);
        done();
      });
    });
  });

  // Test the viewBooksInCart function
  describe("viewBooksInCart", () => {
    it("should retrieve books in cart for a user", (done) => {
      const mockResult = [{ book_id: 100, quantity: 1 }];
      db.query.mockImplementation((sql, values, callback) => {
        callback(null, mockResult);
      });

      viewBooksInCart(1, (err, results) => {
        expect(err).toBeNull();
        expect(results).toEqual(mockResult);
        done();
      });
    });
  });

  // Test the getCartItemCount function
  describe("getCartItemCount", () => {
    it("should get count of unique books in cart", (done) => {
      const mockResult = [{ uniqueBooksCount: 5 }];
      db.query.mockImplementation((sql, values, callback) => {
        callback(null, mockResult);
      });

      getCartItemCount(1, (err, count) => {
        expect(err).toBeNull();
        expect(count).toEqual(5);
        done();
      });
    });
  });

  // Test the updateBookQuantity function
  describe("updateBookQuantity", () => {
    it("should increase the book quantity by 1 if the item exists", (done) => {
      const mockData = { affectedRows: 1, message: "Item quantity updated" };

      // Mock the db.query to return the above mockData
      db.query.mockImplementation((sql, values, callback) => {
        callback(null, mockData);
      });

      updateBookQuantity(1, 1, 1, (err, results) => {
        expect(err).toBeNull();
        expect(results).toEqual(mockData);
        done();
      });
    });

    it("should decrease the book quantity by 1 if the item exists", (done) => {
      const mockData = { affectedRows: 1, message: "Item quantity updated" };

      // Mock the db.query to return the above mockData
      db.query.mockImplementation((sql, values, callback) => {
        callback(null, mockData);
      });

      updateBookQuantity(1, 1, -1, (err, results) => {
        expect(err).toBeNull();
        expect(results).toEqual(mockData);
        done();
      });
    });
  });

  // Test the deleteBookInCart function
  describe("deleteBookInCart", () => {
    it("should delete a book from the cart", (done) => {
      const mockData = { affectedRows: 1, message: "Item deleted from cart" };
      db.query.mockImplementation((sql, values, callback) => {
        callback(null, mockData);
      });

      deleteBookInCart(1, 1, (err, results) => {
        expect(err).toBeNull();
        expect(results).toEqual(mockData);
        done();
      });
    });
  });

  // Test the deleteBooksInCart function
  describe("deleteBooksInCart", () => {
    it("should delete multiple books from the cart", (done) => {
      // Mock data reflecting deletion of multiple items
      const mockData = { affectedRows: 2, message: "Items deleted from cart" };

      // Mocking db.query implementation
      db.query.mockImplementation((sql, values, callback) => {
        // Ensure the query structure is as expected
        expect(sql).toContain("DELETE FROM shopping_cart");
        expect(sql).toContain("WHERE user_id = ?");
        expect(sql).toContain("book_id IN (?, ?)");
        // Validate the values passed into the query (user_id and book_ids)
        expect(values).toEqual(expect.arrayContaining([1, 1, 2])); // Example user_id: 1, book_ids: [1, 2]
        callback(null, mockData);
      });

      // Calling deleteBooksInCart with multiple book IDs
      deleteBooksInCart(1, [1, 2], (err, results) => {
        expect(err).toBeNull();
        expect(results).toEqual(mockData);
        done();
      });
    });
  });
});
