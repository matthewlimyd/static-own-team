import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import FooterComponent from "../components/FooterComponent";
import NavbarComponent from "../components/NavbarComponent";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button"; 
import { useState, useEffect } from "react";
import "../css/Register.css";
import { BASE_URL } from "../Constants";

function TOTPDisplayPage() {
    const [totp, setTotp] = useState([]);
    const [totpSecret, user_id] = useState("");
    const [qrCodeImageUrl, setQrCodeImageUrl] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [idUser, setIdUser] = useState(null);

    const navigate = useNavigate();

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

        // Generate TOTP and set it as the QR code data
        fetch(`https://54.169.83.73:8888/totp/check/${idUser}`, {
      method: 'GET',
      credentials: 'include',
    })
            .then((response) => response.json())
            .then((data) => {
                try{
                    if (data.totp.user_id === idUser) {
                        console.log("pass");
                        fetch(`https://54.169.83.73:8888/totp/generate/${idUser}`, {
      method: 'GET',
      credentials: 'include',
    })
                            .then((response) => response.json())
                            .then((data) => {
                                console.log(data);
                                setQrCodeImageUrl(data.qr_code);
                                console.log(qrCodeImageUrl)
                            });
                    }
                    else{
                        console.log("Not authorized");
                    }
                }
                catch{
                    navigate("/");
                }
            });
  }
}, [idUser]);

    return (
        <>
            <NavbarComponent navStyle="simple" />
            <Container className="container d-flex justify-content-center flex-column align-items-center mt-5 pt-5">
                {loggedIn ? (
                    <>
                        <h3 className="main-title">2FA is required for every logon. Please scan this QR code with your Google Authenticator App for 2FA</h3>
                        {qrCodeImageUrl && (
                            <img src={qrCodeImageUrl} alt="QR Code" />
                        )}
                        <LinkContainer to="/">
                            <Button variant="outline-danger">
                                Done
                            </Button>
                        </LinkContainer>
                    </>
                ) : (
                        <h3 className="main-title">Not authorized to view this page.</h3>
                    )} 
            </Container>
        </>
    );
}

export default TOTPDisplayPage;
