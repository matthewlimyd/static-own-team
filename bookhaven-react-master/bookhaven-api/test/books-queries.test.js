const db = require("../dbConfig");
const {
  getBookFormats,
  getBookCategories,
  getFilteredBooks,
  getBookDetailWithId,
} = require("../queries/books-queries");

jest.mock("../dbConfig");

describe("books-queries", () => {
  // Test 1: getBookFormats
  describe("getBookFormats", () => {
    it("should retrieve book formats", (done) => {
      const mockData = [{ format: "Paperback" }, { format: "Hardcover" }];
      db.query.mockImplementation((sql, callback) => {
        callback(null, mockData);
      });

      getBookFormats((err, results) => {
        expect(err).toBeNull();
        expect(results).toEqual(mockData);
        expect(db.query).toHaveBeenCalledWith(
          "SELECT * FROM book_format",
          expect.any(Function)
        );
        done();
      });
    });
  });

  // Test 2: getBookCategories
  describe("getBookCategories", () => {
    it("should retrieve book categories", (done) => {
      const mockData = [{ category: "Fiction" }, { category: "Non-Fiction" }];
      db.query.mockImplementation((sql, callback) => {
        callback(null, mockData);
      });

      getBookCategories((err, results) => {
        expect(err).toBeNull();
        expect(results).toEqual(mockData);
        expect(db.query).toHaveBeenCalledWith(
          "SELECT * FROM category",
          expect.any(Function)
        );
        done();
      });
    });
  });

  // Test 3: getFilteredBooks
  describe("getFilteredBooks", () => {
    it("should retrieve filtered books", (done) => {
      const mockData = [{ title: "Book1" }, { title: "Book2" }];
      const mockFilters = { limit: 2 };
      db.query.mockImplementation((sql, values, callback) => {
        callback(null, mockData);
      });

      getFilteredBooks(mockFilters, (err, results) => {
        expect(err).toBeNull();
        expect(results).toEqual(mockData);
        // More specific assertions related to SQL query can be added here
        done();
      });
    });
  });

  // Test 4: getBookDetailWithId
  describe("getBookDetailWithId", () => {
    it("should retrieve book details with a specific id", (done) => {
      const mockData = [{ title: "Specific Book" }];
      const bookId = 1;
      db.query.mockImplementation((sql, params, callback) => {
        expect(params[0]).toBe(bookId); // Asserting that correct id is passed
        callback(null, mockData);
      });

      getBookDetailWithId(bookId, (err, results) => {
        expect(err).toBeNull();
        expect(results).toEqual(mockData);
        expect(db.query).toHaveBeenCalledWith(
          "SELECT * FROM books WHERE book_id = ?",
          [bookId],
          expect.any(Function)
        );
        done();
      });
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
});
