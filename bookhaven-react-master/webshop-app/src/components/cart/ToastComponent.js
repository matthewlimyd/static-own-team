import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastComponent = ({ show, setShow, message, isError }) => {
  return (
    <ToastContainer className="p-3 bottom-0 end-0">
      <Toast onClose={() => setShow(false)} show={show} delay={3000} autohide>
        {isError ? (
          <>
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto text-danger">Error!</strong>
            </Toast.Header>
            <Toast.Body>{message}</Toast.Body>
          </>
        ) : (
          <>
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto text-success">Success!</strong>
            </Toast.Header>
            <Toast.Body>{message}</Toast.Body>
          </>
        )}
      </Toast>
    </ToastContainer>
  );
};

export default ToastComponent;
