import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import NavDropdown from "react-bootstrap/NavDropdown";
import Badge from "react-bootstrap/Badge";
import { LinkContainer } from "react-router-bootstrap";
import { useState, useEffect } from "react";
import { BsCartFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router";
import "../css/Navbar.css";
import { fetchCartItemsNumber } from "../utils/cartUtils";

function NavbarComponent(props) {
  const [bookNumber, setBookNumber] = useState(0);
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [idUser, setIdUser] = useState(null);

  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  let admin = false;

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
    const fetchAndSetCartItemsNumber = async () => {
      const userId = idUser; //TODO: Replace with the actual user ID
      if (userId) {
        const count = await fetchCartItemsNumber(userId);
        setBookNumber(count);
      } else {
        //If user is not logged in, cart icon display 0 items in cart
        setBookNumber(0);
      }
    };

    const handleCartUpdate = () => {
      fetchAndSetCartItemsNumber();
    };

    // Fetch the initial count
    fetchAndSetCartItemsNumber();

    // Add event listener
    window.addEventListener("cartUpdated", handleCartUpdate);

    // Cleanup the listener on unmount
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [idUser]);

  function handleLogout() {
    fetch('https://54.169.83.73:8888/auth/api/logout', {
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
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });

    console.log('fetched logout');
    setUsername("");
    setLoggedIn(false);
    if (props.setIsAdmin) {
      props.setIsAdmin(false);
    }
    setShow(true);
    navigate("/");
  }

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="text-danger">
              <img
                className="p-1"
                src="/images/logo.png"
                width="40"
                height="40"
              ></img>
              BookHaven
            </Navbar.Brand>
          </LinkContainer>
          {props.navStyle !== "simple" && (
            <>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                  <LinkContainer to="/">
                    <Button variant="link" className="nav-item">
                      Home
                    </Button>
                  </LinkContainer>
                  <LinkContainer to="/books">
                    <Button variant="link" className="nav-item">
                      Books
                    </Button>
                  </LinkContainer>
                  {admin && (
                    <LinkContainer to="/users">
                      <Button variant="link" className="nav-item">
                        Users
                      </Button>
                    </LinkContainer>
                  )}
                </Nav>
                <Nav>
                  <LinkContainer to="/cart">
                    <Button variant="link" className="nav-item">
                      <BsCartFill />
                      Cart <Badge bg="secondary">{bookNumber}</Badge>{" "}
                    </Button>
                  </LinkContainer>
                  {loggedIn ? (
                    <Button variant="link" className="nav-item">
                      <FaUser />
                      <NavDropdown
                        title={username}
                        id="nav-dropdown-dark-example"
                        menuVariant="dark"
                      >
                        <LinkContainer to="/order">
                          <NavDropdown.Item>Order History</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Item onClick={handleLogout}>
                          Logout
                        </NavDropdown.Item>
                      </NavDropdown>
                    </Button>
                  ) : (
                    <LinkContainer to="/auth/login">
                      <Button variant="outline-danger">Login</Button>
                    </LinkContainer>
                  )}
                </Nav>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
      <ToastContainer className="p-3 top-0 end-0">
        <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
          <Toast.Body>You've been logged out!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default NavbarComponent;
