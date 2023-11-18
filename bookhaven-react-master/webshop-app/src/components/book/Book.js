import React from "react";
import EditBookModal from "./EditBookModal";
import DeleteBookModal from "./DeleteBookModal";
import Button from "react-bootstrap/esm/Button";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";
import { BASE_URL } from "../../Constants";

function Book({
  book_id,
  name,
  author,
  img_paths,
  price,
  old_price,
  rating,
  quantity,
  getBooks,
  isAdmin,
}) {
  const [editModalShow, setEditModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [idUser, setIdUser] = useState(null);

  useEffect(() => {
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
        setUsername(data.userName);
        setIdUser(data.userId);
        setLoggedIn(true);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });

    
  }, []);

  useEffect(() => {
    console.log(idUser);
    
  }, [idUser]);

  const deleteBook = () => {
    fetch(`${BASE_URL}/books/${book_id}`, {
      method: "DELETE",
    }).then((data) => {
      if (data.status === 200) {
        getBooks();
      }
    });
  };

  const handleAddToCart = (id, userId) => {
    const addToCartData = {
      user_id: userId, // TODO: Replace with the actual user ID
      book_id: id,
      quantity: 1,
    };

    fetch(`${BASE_URL}/cart/addToCart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addToCartData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Item added to cart") {
          // Show the toast for 3 seconds
          setShow(true);
          const event = new CustomEvent("cartUpdated");
          window.dispatchEvent(event);

          // setCartItemsNumber(cartItemsNumber + 1);
        }
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
        // Handle the error (e.g., show an error message)
      });
  };

  return (
    <>
      <ToastContainer className="p-3 top-0 end-0">
        <Toast show={show} onClose={() => setShow(false)} delay={3000} autohide>
          <Toast.Body>Book added to cart!</Toast.Body>
        </Toast>
      </ToastContainer>
      {idUser ? (
      <DeleteBookModal
        deleteBook={deleteBook}
        onHide={() => setDeleteModalShow(false)}
        show={deleteModalShow}
      />
    ) : (
      // Render something else or nothing if deleteBook is falsy
      null
    )}
      <EditBookModal
        book_id={book_id}
        name={name}
        author={author}
        img_paths={img_paths}
        price={price}
        old_price={old_price}
        quantity={quantity}
        rating={rating}
        show={editModalShow}
        getBooks={getBooks}
        onHide={() => setEditModalShow(false)}
      />
      <div className="book-card col-lg-3 col-md-4 col-sm-6 col-12 g-3">
        {isAdmin && (
          <div
            className="action-buttons d-flex justify-content-end"
            id={book_id}
          >
            <button className="edit-btn" onClick={() => setEditModalShow(true)}>
              Edit
            </button>
            <button
              className="delete-btn"
              data-bs-toggle="modal"
              data-bs-target="#confirm-delete"
              onClick={() => setDeleteModalShow(true)}
            >
              Delete
            </button>
          </div>
        )}
        <div className="book-img d-flex justify-content-center align-items-center">
          <img src={"../" + img_paths} alt="Book cover" />
        </div>
        <div className="book-info">
          <h4 className="book-name">{name}</h4>
          <p className="author">{author}</p>
          {old_price > 10000 ? ( //crazy amount to ignore
            <h5>
              Price: SGD$
              <span> </span>
              <span className="discounted">{old_price}</span>{" "}
              {/* Use old_price */}
              <span className="price"> {old_price - price} </span>{" "}
            </h5>
          ) : (
            <h5>
              Price: SGD$ <span className="price">{price}</span>
            </h5>
          )}
          <div className="actionButtons">
            <LinkContainer to={"/books/" + book_id}>
              <Button variant="danger">See details</Button>
            </LinkContainer>
            {quantity > 0 && idUser != null ? (
              <button
                className="add-to-cart text-center btn btn-danger mt-2"
                onClick={() => handleAddToCart(book_id, idUser)}
              >
                Add to cart
              </button>
            ) : (
              <button
                className="add-to-cart text-center btn btn-danger mt-2"
                onClick={() => handleAddToCart(book_id)}
                disabled
              >
                Add to cart
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Book;
