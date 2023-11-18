const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
require("dotenv").config();
const rateLimit = require("express-rate-limit");
const stripe = Stripe(process.env.STRIPE_KEY,{ maxNetworkRetries: 0});
const logPayment = require("../logger");
const { addOrder, addOrderBook, getLatestSessionID, updatePaymentStatus, deleteOrderByStripeID} = require("../queries/stripe-queries");


const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // 3 requests in 5 minutes
  message: "Too many Payment Request was Made, please try again later.",
});


// Apply the rate limiter to the create checkout session route
router.post("/create-checkout-session", limiter, async (req, res) => {
  let user = req.body.userId;
  if (user == null){
    user = 1;
  }
  console.log(user);
  //console.log(req.session.userId);
  const line_items = req.body.selectedItems.map((item) => {
    const totalAmountInCents = Math.round(item.quantity * item.price * 100);
    return {
      price_data: {
        currency: "sgd",
        product_data: {
          name: item.name,
          metadata: {
            id: item.id,
          },
        },
        unit_amount: totalAmountInCents,
      },
      quantity: 1,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    success_url: `https://54.169.83.73:8888/stripe/paymentcheck/`+user,
    cancel_url: "https://54.169.83.73:8443/cart",
    
  });
  console.log("Checkout Session Create:", session);
  
  const orderData = {
    user_id: user, // Assuming you have userId in the request
    payment_status: 0, // Update payment_status based on payment status
    stripe_checkout_session: session.id,
  };
  console.log("order Data Line: ", orderData.stripe_checkout_session);

  addOrder(orderData.user_id, orderData.payment_status, orderData.stripe_checkout_session, (err, orderResult) => {
    if (err) {
      // Handle any database error here
      console.error("Database error:", err);
    } else {
      console.log(orderResult.message)
      const order_id = orderResult.orderId; // Retrieve the order_id
      //console.log(selected)
      // Continue with inserting book_id and quantity into the "order_books" table
      req.body.selectedItems.forEach((item) => {
        // Retrieve the correct book_id based on item.id or another property
        const book_id = item.book_id; 
        const quantity = item.quantity;
        // Call the addOrderBook function to insert order_books
        addOrderBook(order_id, book_id, quantity, (err, bookResult) => {
          if (err) {
            // Handle any database error here
            console.error("Database error:", err);
          } else {
            console.log(bookResult.message);
          }
        });
      });
    }
  });

  //listen for post request after checkout session is created
  router.post('/webhook', express.json({type: 'application/json'}), (request, response) => {
    const event = request.body;
    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
        console.log("Session ID used to compare: ", sessionID);
        console.log("Completed Payment Session:",checkoutSessionCompleted);
        if (checkoutSessionCompleted.id == sessionID) {
          
          };
          if (checkoutSessionCompleted.id !== sessionID) {
            logPayment.warn(`Checkout Session ID mismatch: ${checkoutSessionCompleted.id}`);
            };
        break;
    }

    response.json({received: true});
  });
  res.json({ url: session.url });
});

router.get("/paymentcheck/:user_id", (req, res) => {
  const userId = req.params.user_id;

  // Use the getLatestSessionID function to retrieve the latest session ID
  getLatestSessionID(userId, async (err, sessionID) => {
    if (err) {
      // Handle the database error here
      console.error("Database error:", err);
      res.status(500).json({ error: "Failed to retrieve session ID" });
    } else if (sessionID) {
      // Session ID was found
      const session = await stripe.checkout.sessions.retrieve(sessionID);

      if (session.payment_status === 'paid') {
        console.log("Payment is paid. Redirecting to localhost:3000");
        
        // Perform the payment status update
        const updatePayment = 1;
        updatePaymentStatus(userId, sessionID, updatePayment, (err, result) => {
          if (err) {
            console.error("SQL Error:", err);
            res.status(500).json({ error: "error" });
          } else {
            res.redirect("https://54.169.83.73:8443/order");
            deleteOrderByStripeID(sessionID, (err, result) => {
              if (err) {
                console.error("SQL Error:", err);
                res.status(500).json({ error: "error" });
              } else {
                console.log("hit");    
              }
            });
            
          }
        });
      } else {
        // Payment is not paid; you can handle this case as needed
        res.status(200).json({ message: "Payment is not yet paid" });
      }
    } else {
      // No matching records found
      res.status(404).json({ message: "No Stripe Checkout Session found for the user." });
    }
  });
});




module.exports = router;
