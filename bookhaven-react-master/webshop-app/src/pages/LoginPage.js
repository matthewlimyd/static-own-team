import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import InputGroup from "react-bootstrap/InputGroup";
import FooterComponent from "../components/FooterComponent";
import NavbarComponent from "../components/NavbarComponent";
import { FaUser } from "react-icons/fa";
import { FaUnlock } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { useState, useEffect } from "react";
import "../css/LoginPage.css";
import { BASE_URL } from "../Constants";

function LoginPage() {
    const [inputs, setInputs] = useState({ username: "", password: "", totp: "" });
    const [show, setShow] = useState(false);
    const [error, setError] = useState(false);
    const [validated, setValidated] = useState(false);
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);

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
        setLoggedIn(true);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
    }, []);

    function handleChange(e) {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value
        });
    }

    function handleSubmit(e) {
        const form = e.currentTarget;

        setValidated(true);
        e.preventDefault();
        if (form.checkValidity()) {
            fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: inputs.username,
                    password: inputs.password,
                    totp: inputs.totp
                })
            })
                .then((response) => response.json())
                .then((data) => {
                    if (!data.error) {
                        console.log('went here');
                        console.log(data);
                        setError(false);
                        setShow(true);
                        setTimeout(() => {
                            navigate("/");
                        }, 3000);
                    } else {
                        setError(true);
                        setInputs({ ...inputs, password: "", totp: "" });
                        setShow(true);
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        }
    }

    return (
        <>
            <NavbarComponent navStyle="simple" />
            <>
                <Container className="container d-flex justify-content-center flex-column align-items-center mt-5 pt-5">
                    {loggedIn ? (
                        <>
                            <h3 className="main-title">You are logged in.</h3>
                            <LinkContainer to="/">
                                <Button variant="outline-danger">
                                    Go to Home page
                                </Button>
                            </LinkContainer>
                        </>
                    ) : (
                        <>
                            <h1 className="main-title">
                                Login to your account
                            </h1>
                            <Form
                                className="login-form mt-4"
                                noValidate
                                validated={validated}
                                onSubmit={handleSubmit}
                            >
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FaUser />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={inputs.username}
                                        onChange={handleChange}
                                        placeholder="Username"
                                        aria-label="Username"
                                        aria-describedby="basic-addon1"
                                        pattern="^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid username.
                                    </Form.Control.Feedback>
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FaUnlock />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={inputs.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                        aria-label="Password"
                                        aria-describedby="basic-addon1"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a password.
                                    </Form.Control.Feedback>
                                </InputGroup>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text>
                                        <FaUser />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        name="totp"
                                        value={inputs.totp}
                                        onChange={handleChange}
                                        placeholder="TOTP"
                                        aria-label="Totp"
                                        aria-describedby="basic-addon1"
                                        pattern="^\d{6}$"
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please provide a valid TOTP.
                                    </Form.Control.Feedback>
                                </InputGroup>
                                <div className="text-center">
                                    <Button
                                        type="submit"
                                        variant="outline-danger"
                                        className="w-100 mt-3"
                                    >
                                        Login
                                    </Button>
                                    <Form.Text>
                                        You don't have an account?{" "}
                                        <LinkContainer
                                            to="/auth/register"
                                            className="register-link text-danger"
                                        >
                                            <span>Register</span>
                                        </LinkContainer>
                                    </Form.Text>
                                </div>
                            </Form>
                        </>
                    )}
                </Container>
                <div className="login-footer">
                    <FooterComponent />
                </div>
            </>
            <ToastContainer className="p-3 top-0 end-0">
                <Toast
                    onClose={() => setShow(false)}
                    show={show}
                    delay={3000}
                    autohide
                >
                    {error ? (
                        <>
                            <Toast.Header>
                                <img
                                    src="holder.js/20x20?text=%20"
                                    className="rounded me-2"
                                    alt=""
                                />
                                <strong className="me-auto text-danger">
                                    Error!
                                </strong>
                            </Toast.Header>
                            <Toast.Body>
                                Failed to login! Please
                                try again.
                            </Toast.Body>
                        </>
                    ) : (
                        <Toast.Body>Successfully logged in!</Toast.Body>
                    )}
                </Toast>
            </ToastContainer>
        </>
    );
}

export default LoginPage;
