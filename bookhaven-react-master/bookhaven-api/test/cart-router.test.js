const request = require("supertest");
const express = require("express");
const cartRouter = require("../routes/cart");

// Mock the query methods
jest.mock("../dbConfig");
jest.mock("../queries/cart-queries");
const {
  addToCart,
  viewBooksInCart,
  getCartItemCount,
  updateBookQuantity,
  deleteBookInCart,
  deleteBooksInCart,
} = require("../queries/cart-queries");

const app = express();
app.use(express.json());
app.use("/", cartRouter);

let server;

beforeAll(() => {
  server = app.listen(4001);
});

afterAll((done) => {
  server.close(done);
});

describe("Cart Router", () => {
  describe("POST /addToCart", () => {
    it("should add a book to the cart", async () => {
      const mockData = { message: "Item added to cart" };
      addToCart.mockImplementation((user_id, book_id, quantity, callback) =>
        callback(null, mockData)
      );

      const response = await request(app)
        .post("/addToCart")
        .send({ user_id: 1, book_id: 100, quantity: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: mockData.message,
        cartData: mockData,
      });
    });
  });

  describe("GET /viewBooksInCart/:user_id", () => {
    it("should retrieve books in cart for a user", async () => {
      const mockData = [{ book_id: 100, quantity: 1 }];
      viewBooksInCart.mockImplementation((user_id, callback) =>
        callback(null, mockData)
      );

      const response = await request(app).get("/viewBooksInCart/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ cartItems: mockData });
    });
  });

  describe("GET /getCartItemCount/:user_id", () => {
    it("should get the number of unique books in the shopping cart for a user", async () => {
      const mockData = { uniqueBooksCount: 5 };
      getCartItemCount.mockImplementation((user_id, callback) =>
        callback(null, mockData)
      );

      const response = await request(app).get("/getCartItemCount/1");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });

  describe("PUT /updateBookQuantity/:book_id", () => {
    it("should update the quantity of a book in the shopping cart", async () => {
      const mockData = { message: "Quantity updated" };
      updateBookQuantity.mockImplementation(
        (user_id, book_id, adjustmentValue, callback) =>
          callback(null, mockData)
      );

      const response = await request(app)
        .put("/updateBookQuantity/100")
        .send({ userId: 1, adjustmentValue: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockData);
    });
  });

  describe("DELETE /deleteBookInCart/:book_id", () => {
    it("should delete a book from the shopping cart", async () => {
      const mockData = { message: "Item removed", affectedRows: 1 };
      deleteBookInCart.mockImplementation((user_id, book_id, callback) =>
        callback(null, mockData)
      );

      const response = await request(app)
        .delete("/deleteBookInCart/100")
        .send({ userId: 1 });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: mockData.message });
    });
  });

  describe("DELETE /deleteBooksInCart", () => {
    it("should delete multiple books from the shopping cart", async () => {
      // Mocking the data to reflect the deletion of multiple items
      const mockData = { message: "Items removed", affectedRows: 2 };

      // Mocking the implementation of deleteBooksInCart
      deleteBooksInCart.mockImplementation((user_id, book_ids, callback) =>
        callback(null, mockData)
      );

      // Sending the DELETE request with a user ID and an array of book IDs in the body
      const response = await request(app)
        .delete("/deleteBooksInCart")
        .send({ userId: 1, bookIds: [1, 2] }); // Adjust bookIds as needed

      // Assertions to verify the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: mockData.message });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
