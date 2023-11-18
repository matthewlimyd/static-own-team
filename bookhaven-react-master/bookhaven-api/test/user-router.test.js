const request = require("supertest");
const express = require("express");
const userRouter = require("../routes/user");

// Mock the query methods
jest.mock("../dbConfig");
jest.mock("../queries/user-queries");
const {
  registerUser,
  compareUsername,
  getUserCreds,
  getUserID,
} = require("../queries/user-queries");

const app = express();
app.use(express.json());
app.use("/", userRouter);

let server;

beforeAll(() => {
  server = app.listen(4001);
});

afterAll((done) => {
  server.close(done);
});

describe("User Router", () => {
  describe("POST /register", () => {
    it(" should register new user", async () => {
      const mockData = { message: "Successfully registed" };
      registerUser.mockImplementation((username,first_name,last_name,email,password,address, callback) =>
        callback(null, mockData)
      );

      const response = await request(app)
        .post("/register")
        .send({ username: "test",first_name: "test",last_name:"test",email:"test1@email.com",password:"test",address: "test ave"});
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: mockData.message,
        cartData: mockData,
      });
    });
  });

  // describe("POST /login", () => {
  //   it(" should login to the app", async () => {
  //     const mockData = 12;
  //     getUserCreds.mockImplementation((username, callback) =>
  //       callback(null, [{user_id: mockData}])
  //     );

  //     const response = await request(app)
  //       .post("/login")
  //       .send({ username: "girly",password:"girly"});
  //     expect(response.status).toBe(200);
  //     expect(response.body).toEqual({
  //       userData: mockData,
      
      
  //     });
  //   });
  // });
});
