import React, { useContext } from "react";
import {
  Accordion,
  Button,
  Card,
  AccordionContext,
  useAccordionButton,
} from "react-bootstrap";

function ContextAwareToggle({ eventKey, callback }) {
  const { activeEventKey } = useContext(AccordionContext);

  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey)
  );

  const isCurrentEventKey = activeEventKey === eventKey;

  return (
    <Button 
      onClick={decoratedOnClick} 
      variant="outline-dark" 
      className="btn-collapse collapsed" 
      type="button" data-bs-toggle="collapse" 
      aria-expanded="false" 
      aria-controls="collapseExample"
      >
      {isCurrentEventKey ? (
        <i className="fas fa-chevron-circle-up"></i>
      ) : (
        <i className="fas fa-chevron-circle-down"></i>
      )}
    </Button>
  );
}
export default function Order({
  id,
  order,
  email,
  name,
  date,
  price,
  quantity,
  total,
  deliveryAddress,
  billingAddress
}) {
  let count = 1;
  let dateTransformed = new Date(date);
  let dateParsed =
    dateTransformed.getDate() +
    "/" +
    (dateTransformed.getMonth() + 1) +
    "/" +
    dateTransformed.getFullYear() +
    " " +
    dateTransformed.getHours() +
    ":" +
    dateTransformed.getMinutes() +
    ":" +
    dateTransformed.getSeconds();

  return (
    <Accordion defaultActiveKey="1">
      <Card>
        <Card.Header>
          <p className="fw-bold">
            Order
            <span className="text-success"> {id}</span>
          </p>
          <ContextAwareToggle eventKey="0"></ContextAwareToggle>
        </Card.Header>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <h6>
              Email: <span className="fw-light fst-italic">{email}</span>
            </h6>
            <h6>
              Delivery Address:
              <span className="fw-light fst-italic">
                {deliveryAddress}
              </span>
            </h6>
            <h6>
              Billing Address:
              <span className="fw-light fst-italic">
                {billingAddress}
              </span>
            </h6>
            <h6>
              Ordered on:
              <span className="fw-light fst-italic"> {dateParsed}</span>
            </h6>
            <br />
            <h6>
              Item:
              <span className="fw-light fst-italic"> {name}</span>
            </h6>
            <h6>
              Item Price:
              <span className="fw-light fst-italic"> {price} SGD</span>
            </h6>
            <h6>
              Quantity:
              <span className="fw-light fst-italic"> {quantity}</span>
            </h6>
            <br />
            <h6>
              Total:
              <span className="fw-light fst-italic"> {total} SGD</span>
            </h6>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
