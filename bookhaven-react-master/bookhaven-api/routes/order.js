const express = require("express");
const router = express.Router();

// Import getOrdersForUser functions order-queries.js
const { getOrdersForUser } = require("../queries/order-queries");

// Endpoint to get orders for a specific user
router.get("/user/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  // Call the getOrdersForUser function to retrieve orders for a specific user
  getOrdersForUser(user_id, (err, order) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to retrieve orders for user" });
    } else {
      console.log("order result in order router");
      console.log(order);
      res.status(200).json({ order });
    }
  });
});

module.exports = router;