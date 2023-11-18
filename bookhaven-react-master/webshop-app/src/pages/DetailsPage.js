import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import FooterComponent from "../components/FooterComponent";
import NavbarComponent from "../components/NavbarComponent";
import Breadcrumbs from "../components/Breadcrumbs";
import { FaStar, FaRegStar } from "react-icons/fa";

import "../css/BookDetails.css";
import { BASE_URL } from "../Constants";

function DetailsPage() {
  const [book, setBook] = useState(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  let rating = [1, 2, 3, 4, 5];

  useEffect(() => {
    const afterLastSlash = window.location.pathname.substring(
      window.location.pathname.lastIndexOf("/") + 1
    );
    axios.get(`${BASE_URL}/books/${afterLastSlash}`).then(function (response) {
      setBook(response.data[0]);
      setLoading(false);
    });
  }, []);

  const handleAddToCart = (id) => {
    console.log("id:", id);
    const addToCartData = {
      user_id: 1, // TODO: Replace with the actual user ID
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
        }
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
        // Handle the error (e.g., show an error message)
      });
  };

  return (
    <>
      <NavbarComponent />
      <>
        {!loading && book && <Breadcrumbs customLabel={book.name} />}
        {book ? (
          <div className="container container-footer" id="container">
            <div className="title mt-3">
              <h4 className="title details-title" id="name">
                {book.name}
              </h4>
              <h5 className="details-author text-danger" id="author">
                {book.author}
              </h5>
            </div>
            <div className="container container-details mt-3">
              <div className="row">
                <div className="col-sm-6 col-12" id="book-img">
                  <img
                    className="book-details-img"
                    src={"../" + book.img_paths}
                    alt="Book cover"
                  ></img>
                </div>
                <div
                  className="details col-sm-6 col-12 align-self-center"
                  id="book-details"
                >
                  <h5>
                    ISBN : <span className="detail-value">{book.isbn}</span>
                  </h5>
                  {book.discount > 0 ? (
                    <h5>
                      Price : <span className="discounted">{book.price}</span>{" "}
                      <span id="price">{book.price - book.discount}</span> SGD
                    </h5>
                  ) : (
                    <h5>
                      Price : <span id="price">{book.price}</span> SGD
                    </h5>
                  )}
                  <div id="rating">
                    <h5 className="d-flex align-items-center">
                      Rating :
                      {rating.map((item) => {
                        if (book.rating >= item) {
                          return <FaStar className="star" key={item} />;
                        } else {
                          return <FaRegStar className="star" key={item} />;
                        }
                      })}
                      {book.rating > 0 ? (
                        <span> ({book.rating})</span>
                      ) : (
                        <span> (-)</span>
                      )}
                    </h5>
                  </div>
                  <h5>
                    Author : <span className="detail-value">{book.author}</span>
                  </h5>
                  <h5>
                    In stock :
                    {book.quantity > 0 ? (
                      <span className="detail-value"> YES</span>
                    ) : (
                      <span className="detail-value"> NO</span>
                    )}
                  </h5>
                  {book.quantity > 0 ? (
                    <button
                      id="add-to-cart"
                      className="text-center btn btn-outline-danger mt-3"
                      onClick={() => handleAddToCart(book.book_id)}
                    >
                      Add to cart
                    </button>
                  ) : (
                    <button
                      id="add-to-cart"
                      className="text-center btn btn-outline-danger mt-3"
                      onClick={() => handleAddToCart(book.book_id)}
                      disabled
                    >
                      Add to cart
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <ToastContainer className="p-3 top-0 end-0">
          <Toast
            onClose={() => setShow(false)}
            show={show}
            delay={3000}
            autohide
          >
            <Toast.Body>Book added to cart!</Toast.Body>
          </Toast>
        </ToastContainer>
        <div className="details-footer">
          <FooterComponent />
        </div>
      </>
    </>
  );
}

export default DetailsPage;
