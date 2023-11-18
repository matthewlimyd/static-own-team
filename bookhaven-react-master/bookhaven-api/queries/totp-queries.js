const speakeasy = require('speakeasy');

const db = require("../dbConfig");

const checkTOTP  = (user_id, callback) => {
  const sql = "SELECT user_id FROM bookhaven.user WHERE user_id = ? AND otp_secret_key = '' LIMIT 1;";
  db.query(sql, [user_id], (err, results,fields) => {
      if (err) {
          callback(err);
      }
      else {
          console.log("order for totp results here");
      	  console.log(results[0]);
          callback(null,results[0]);
      }
  });
};

const insertTOTP  = (user_id, secret, callback) => {
  const sql = "UPDATE user SET otp_secret_key = CASE WHEN otp_secret_key = '' THEN ? ELSE otp_secret_key END WHERE user_id = ?;";
  db.query(sql, [secret, user_id], (err, results,fields) => {
      if (err) {
          callback(err);
      }
      else {
          console.log('success');
      }
  });
};

const verifyTOTP  = (username, totp, callback) => {
  const sql = "SELECT otp_secret_key FROM bookhaven.user WHERE username = ? LIMIT 1;";
  db.query(sql, [username], (err, otpresults,fields) => {
      if (err) {
          callback(err);
      }
      else {
          console.log("order for totp results here");
          console.log(otpresults[0].otp_secret_key);
          const secret = otpresults[0].otp_secret_key;

          const verified = speakeasy.totp.verify({
            secret,
            encoding: 'base32',
            token: totp,
            window: 6, // Validate within a 3-minute window (3x30 seconds)
          });
          console.log(verified);
          if (verified) {
            console.log('OTP is valid. User is authenticated.');
          } else {
            console.log('OTP is invalid. Authentication failed.');
          }

          callback(null,verified);
      }
  });
};

module.exports = {
	checkTOTP,
  insertTOTP,
  verifyTOTP
};