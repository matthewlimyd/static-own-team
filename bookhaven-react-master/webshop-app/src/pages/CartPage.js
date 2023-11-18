import Container from "react-bootstrap/esm/Container";
import "../css/CartPage.css";
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import NavbarComponent from "../components/NavbarComponent";
import FooterComponent from "../components/FooterComponent";
import OrderSummary from "../components/cart/OrderSummary";
import ToastComponent from "../components/cart/ToastComponent";
import { BASE_URL } from "../Constants";
import axios from "axios";

function CartPage() {
  const userId = 1; // TODO: Replace with the actual user ID
  console.log(userId);
  const isLoggedIn = userId ? true : false;


  const [cartItems, setCartItems] = useState([]);
  const [totalCartValue, setTotalCartValue] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
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
        console.log("wahaha" + idUser.toString());
        console.log(loggedIn);
        
        }
    }, [idUser]);

  // Fetch the books in cart from the backend
  const fetchCartItems = useCallback(() => {
    fetch(`${BASE_URL}/cart/viewBooksInCart/${idUser}`)
      .then((response) => response.json())
      .then((data) => {
        setCartItems(data.cartItems);
      })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      });
  }, [idUser]);

  //Hook to fetch books in cart when user changes
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // Function to handle changes in the quantity of a book in the cart
  const changeQuantity = async (book_id, type) => {
    const isIncrease = type === "increase";
    const adjustmentValue = isIncrease ? 1 : -1;

    try {
      const response = await fetch(
        `${BASE_URL}/cart/updateBookQuantity/${book_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idUser, adjustmentValue }),
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(
          responseData.error ||
            "Failed to adjust the item quantity in the backend."
        );
      }

      // Update the books in cart
      fetchCartItems();
      const event = new CustomEvent("cartUpdated");
      window.dispatchEvent(event);
    } catch (error) {
      setError(true);
      setMessage(
        error.message || "Failed to adjust the item quantity in the backend."
      );
      setShow(true);
      return;
    }
  };

  // Function to delete a book from the cart
  const deleteCartItem = async (book_id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/cart/deleteBookInCart/${book_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idUser }),
        }
      );

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(
          responseData.error ||
            "Failed to delete the cart item from the backend."
        );
      }

      // Update the books in cart
      fetchCartItems();
      const event = new CustomEvent("cartUpdated");
      window.dispatchEvent(event);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Function to handle selection of products
  const handleProductSelection = (selectedItem) => {
    // Check if the item is already selected
    const isSelected = selectedItems.some(
      (item) => item.book_id === selectedItem.book_id
    );

    if (isSelected) {
      // If selected, remove it from the selectedItems array
      setSelectedItems(
        selectedItems.filter((item) => item.book_id !== selectedItem.book_id)
      );
    } else {
      // If not selected, add it to the selectedItems array
      setSelectedItems([...selectedItems, selectedItem]);
    }
  };

  // Update total cart value when selectedItems or cartItems change
  useEffect(() => {
    let sum = 0;
    cartItems.forEach((item) => {
      if (selectedItems.some((selected) => selected.book_id === item.book_id)) {
        sum += item.quantity * item.price;
      }
    });
    setTotalCartValue(sum.toFixed(2));
  }, [cartItems, selectedItems]);

  // Function to delete selected items from the cart
  const deleteSelectedItemsFromCart = async () => {
    try {
      // Get the book IDs of the selected items
      const bookIdsToDelete = selectedItems.map((item) => item.book_id);
      const response = await fetch(`${BASE_URL}/cart/deleteBooksInCart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idUser, bookIds: bookIdsToDelete }),
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(
          responseData.error ||
            "Failed to delete the cart items from the backend."
        );
      }

      // Update the books in cart
      fetchCartItems();
      const event = new CustomEvent("cartUpdated");
      window.dispatchEvent(event);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handlePlaceOrder = (id) => {
    // Check if there are items selected in the cart
    if (selectedItems.length === 0) {
      setError(true);
      setMessage("Please select at least one item.");
      setShow(true);
      return;
    }
    console.log("this is the id");
    console.log(id);

    // Send a request to the backend
    axios.post(`${BASE_URL}/stripe/create-checkout-session`, {
        selectedItems,
        userId: id.idUser,
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.url) {
          window.location.href = res.data.url;
          setError(false);
        }
        deleteSelectedItemsFromCart();
        setSelectedItems([]);
      })
      .catch((error) => {
        if (error.response && error.response.status === 429) {
          // Handle the rate limit exceeded error
          setError(true);
          setMessage("Too many requests, please try again later.");
          setShow(true);
        } else {
          console.error("An error occurred:", error);
        }
      });
  }

  const orderSummary = (
    <OrderSummary
      cartItems={cartItems}
      totalCartValue={totalCartValue}
      changeQuantity={changeQuantity}
      deleteCartItem={deleteCartItem}
      handleProductSelection={handleProductSelection}
      selectedItems={selectedItems}
      setSelectedItems={setSelectedItems}
    />
  );

  return (
        <>
            <NavbarComponent />
            <>
                <div className="order-main">
                    {loggedIn && cartItems.length > 0 ? (
                        <>
                            <ToastComponent
                              show={show}
                              setShow={setShow}
                              message={message}
                              isError={error}
                            />
                            <Container className="mt-5 pt-5 text-center">
                              {orderSummary}
                              <div className="d-flex justify-content-end mt-3">
                                {idUser ? ( // Check if idUser is set (truthy)
      <button
        className="order-btn btn btn-outline-dark"
        type="submit"
        onClick={() => handlePlaceOrder({idUser})}
      >
        Place Order
      </button>
    ) : null}
                              </div>
                            </Container>
                        </>
                    ) : loggedIn && cartItems.length === 0 ? (
                    <>
                        <ToastComponent
                          show={show}
                          setShow={setShow}
                          message={message}
                          isError={error}
                        />
                        <Container className="mt-5 pt-5 text-center">
                          <h4>Your cart is empty</h4>

                          <Link to="/books">Continue shopping</Link>
                          </Container>
                          </>
                    ) : (
                    <>
                        <Container className="mt-5 pt-5 text-center">
                          <h4>Please log in to view your cart</h4>

                          <Link to="/auth/login">Log in</Link>
                        </Container>
                        </>
                    )}
                </div>
                <FooterComponent />
            </>
        </>
    );
}

export default CartPage;
