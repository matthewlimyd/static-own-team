const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
// Import from user-queries.js
const { registerUser } = require("../queries/user-queries");
const { getUserCreds, getUserID } = require("../queries/user-queries");

// Import from totp-queries.js
const { verifyTOTP } = require("../queries/totp-queries");

// Endpoint to compare passwords of existing users in the database
router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const totp = req.body.totp;
  
  // Call the login function
  getUserCreds(username, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to login" });
      return;
    } else {
      bcrypt.compare(password, result, function(err, result) {
        if (err) {
          console.error(err);
          res.status(401).json({ error: "Failed to login" });
          return;
        }
        if (result) {
          getUserID(username, (err, result) => {
            if (err) {
              console.error(err);
              return;
            } else {
              console.log(result);
              
              // After username/pw correct - Verify OTP before returning
              verifyTOTP(username, totp, (err, otpresult) => {
                if (err) {
                  console.error(err);
                  return;
                } else{
                  console.log(otpresult);
                  if (otpresult){
                    console.log('success login otp');
                    console.log(result.user_id);
                    req.session.userId = result.user_id;
                    console.log(req.session.userId);
                    req.session.userName = result.username;
                    console.log("result.user_id");
                    res.status(200).json({ userData: result });
                  }
                  else{
                    console.log('fail login otp');
                    res.status(401).json({ error: 'Failed to login' });
                    return;
                  }
                }
              });
            }
          });
        }
      });
    }
  });
});

// Login after register
router.post("/loginAfterReg", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // Call the login function
  getUserCreds(username, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to login" });
      return;
    } else {
      bcrypt.compare(password, result, function(err, result) {
        if (err) {
          console.error(err);
          res.status(401).json({ error: "Failed to login" });
          return;
        }
        if (result) {
          getUserID(username, (err, result) => {
            if (err) {
              console.error(err);
              return;
            } else {
              console.log(result);
              console.log("result.user_id");
              console.log(result.user_id);
              req.session.userId = result.user_id;
              req.session.userName = result.username;
              res.status(200).json({ userData: result });
            }
          });
        }
      });
    }
  });
});

// Endpoint to add newly registered users into the database
router.post("/register", async (req, res) => {
  const { username, first_name, last_name, email, password, address } = req.body;
  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10); // The second parameter is the number of salt rounds
  // Call the register function to add the item to the cart
  registerUser(username, first_name, last_name, email, hashedPassword, address, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to register user" });
      return;
    }
    res.status(200).json({ message: result.message, cartData: result });
  });
});

router.get('/api/session', (req, res) => {
  if (req.session.userId) {
    console.log('Session exists. User ID:', req.session.userId);
    console.log('Session exists. Username:', req.session.userName);
    res.json({ message: 'Session exists', userId: req.session.userId, userName: req.session.userName });
  } else {
    console.log('No session found.');
    res.json({ message: 'No session found' });
  }
});

router.get('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Session destroyed' });
});

module.exports = router;
