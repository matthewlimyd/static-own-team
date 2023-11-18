const express = require("express");
const router = express.Router();
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

// Import checkTOTP functions order-queries.js
const { checkTOTP } = require("../queries/totp-queries");
const { insertTOTP } = require("../queries/totp-queries");

// Function to generate a TOTP key for a user
function generateTOTP() {
  const secret = speakeasy.generateSecret();
  const otpauth_url = speakeasy.otpauthURL({
    secret: secret.base32,
    label: "BookHaven",
    issuer: "OTP",
    encoding: 'base32',
  });

  return { secret: secret.base32, otpauth_url };
}

// Endpoint to get totp status for a specific user
router.get("/check/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  // Call the checkTOTP function to retrieve TOTP for a specific user
  checkTOTP(user_id, (err, totp) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve TOTP for user" });
    } else {
      console.log("TOTP result");
      console.log(totp);
      res.status(200).json({ totp });
    }
  });
});

router.get("/generate/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  // Generate TOTP key and QR code
  const totpData = generateTOTP();

  // Generate QR code from otpauth URL
  QRCode.toDataURL(totpData.otpauth_url, (err, data_url) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to generate QR code" });
    } else {

      // Check totp again, before insert and display
      checkTOTP(user_id, (err, totp) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to retrieve TOTP for user" });
        } else {
          insertTOTP(user_id, totpData.secret);
          res.status(200).json({ qr_code: data_url });
        }
      });

    }
  });
});

module.exports = router;
