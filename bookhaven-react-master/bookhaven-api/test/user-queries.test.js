const db = require("../dbConfig");
const {
  registerUser,
  compareUsername,
  getUserCreds,
  getUserID,
} = require("../queries/user-queries");

jest.mock("../dbConfig");

describe("registerUser", () => {
  // Test 1: registerUser
  describe("registerUser", () => {
    it("should register new user", (done) => {
      const mockData = { message: "Successfully registered" };
      db.query.mockImplementation((sql, values,callback) => {
        callback(null, mockData);
      });

      registerUser("hehe","hehe","hehe","hehe@test.com","hehe","hehe ave",(err, results) => {
        expect(err).toBeNull();
        expect(results).toEqual(mockData);
        done();
      });
    });
  });

  //Test 3:getUserCred
  describe("getUserCreds", () => {
    it('should return the password for a valid username', done => {
      const mockPassword = 'test';
      db.query.mockImplementation((sql, params, callback) => {
          callback(null, [{ password: mockPassword }]);
      });

      getUserCreds('test', (err, result) => {
          expect(result).toBe(mockPassword);
          done();
      });
  });
  });

  //Test 4:getUserID
  // describe("getUserID", () => {
  //   it("should get user id", (done) => {
  //     const mockData =  9 ;
  //     db.query.mockImplementation((sql, values, callback) => {
  //       callback(null, [{user_id: mockData}]);
  //     });

  //     getUserID("test",(err, results) => {
  //       expect(err).toBeNull();
  //       expect(results).toEqual(mockData);
  //       done();
  //     });
  //   });
  // });
  
});
