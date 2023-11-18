const request = require("supertest");
const express = require("express");
const booksRouter = require("../routes/books");

// Mock the query methods
jest.mock("../dbConfig");
jest.mock("../queries/books-queries");
const {
  getBookFormats,
  getBookCategories,
  getFilteredBooks,
  getBookDetailWithId,
} = require("../queries/books-queries");

const app = express();
app.use(express.json());
app.use("/", booksRouter);

// Store the server instance
let server;

beforeAll(() => {
  // Start the server before all tests
  server = app.listen(); // you may pass a port number
});

afterAll((done) => {
  // Close the server after all tests
  server.close(done);
});

describe("Books Router", () => {
  describe("GET /formats", () => {
    it("should return book formats", async () => {
      const mockData = [{ format: "Paperback" }, { format: "Hardcover" }];
      getBookFormats.mockImplementation((callback) => callback(null, mockData));

      const response = await request(app).get("/formats");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });

    // it("should handle errors", async () => {
    //   getBookFormats.mockImplementation((callback) =>
    //     callback(new Error("Test error"), null)
    //   );

    //   const response = await request(app).get("/formats");
    //   expect(response.status).toBe(500);
    //   expect(response.body).toEqual({ error: "Failed to retrieve data" });
    // });
  });

  describe("GET /categories", () => {
    it("should return book categories", async () => {
      const mockData = [{ category: "Fiction" }, { category: "Non-Fiction" }];
      getBookCategories.mockImplementation((callback) =>
        callback(null, mockData)
      );

      const response = await request(app).get("/categories");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });

  describe("GET /books", () => {
    it("should return filtered books", async () => {
      const mockData = [{ title: "Book1" }, { title: "Book2" }];
      getFilteredBooks.mockImplementation((filters, callback) =>
        callback(null, mockData)
      );

      const response = await request(app).get("/books");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });

  describe("GET /:book_id", () => {
    it("should return book details for a given ID", async () => {
      const bookId = "1";
      const mockData = [{ title: "Specific Book" }];
      getBookDetailWithId.mockImplementation((book_id, callback) =>
        callback(null, mockData)
      );

      const response = await request(app).get(`/${bookId}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
