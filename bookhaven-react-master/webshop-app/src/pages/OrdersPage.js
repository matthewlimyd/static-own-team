import FooterComponent from "../components/FooterComponent";
import NavbarComponent from "../components/NavbarComponent";
import Order from "../components/Order";
import "../css/Orders.css";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [cartItemsNumber, setCartItemsNumber] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);
    const [idUser, setIdUser] = useState(null);

    useEffect(() => {
        // Check for logged in
        fetch('https://54.169.83.73:8888/auth/api/session', {
      method: 'GET',
      credentials: 'include',
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then(data => {
      console.log('Data received:', data);
      if (data.userId){
        console.log(data.userId);
        setLoggedIn(true);
        setIdUser(data.userId);

        console.log(data.userId);
        
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });

        
    }, []);

    useEffect(() => {
        if (idUser) {
        console.log(idUser);
        const cartItems = JSON.parse(localStorage.getItem("items"));
        let counter = 0;
        if (cartItems) {
            for (let i = 0; i < cartItems.length; i++) {
                counter = counter + cartItems[i].quantity;
            }
            setCartItemsNumber(counter);
        }

        fetch(`https://54.169.83.73:8888/order/user/${idUser}`, {
      method: 'GET',
      credentials: 'include',
    })
            .then((response) => response.json())
            .then((data) => {
                // Update the orders state with the fetched data
                setOrders(data.order);
            });
        }
    }, [idUser]);

    return (
        <>
            <NavbarComponent cartItemsNumber={cartItemsNumber} />
            <>
                <div className="order-main">
                    {loggedIn && orders.length > 0 ? (
                        <>
                            {orders.map((order) => (
                                <Order
                                    key={order.order_id}
                                    order={order}
                                    id={order.order_id}
                                    email={order.email}
                                    name={order.name}
                                    date={order.date}
                                    price={order.price}
                                    total={order.total}
                                    quantity={order.quantity}
                                    deliveryAddress={order.address}
                                    billingAddress={order.address}
                                />
                            ))}
                        </>
                    ) : loggedIn && orders.length === 0 ? (
                        <div className="text-center mt-5">
                            <h3>You don't have any orders yet</h3>
                            <Link to="/">Go back to Home page</Link>
                        </div>
                    ) : (
                        <div className="text-center mt-5">
                            <h3>You're not allowed on this page</h3>
                            <Link to="/">Go back to Home page</Link>
                        </div>
                    )}
                </div>
                <FooterComponent />
            </>
        </>
    );
}

export default OrdersPage;
