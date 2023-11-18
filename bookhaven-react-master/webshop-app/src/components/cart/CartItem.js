function CartItem({ cartItem, changeQuantity, showDeleteModal, handleSelection, isSelected }) {
  // Calculate the price with two decimal places
  const itemPrice = parseFloat(cartItem.price).toFixed(2);
  const calculatedPrice = (cartItem.quantity * itemPrice).toFixed(2);
  return (
    <div className="p-2 item-container">
      <div className="multi-select-checkbox">
        <input
            type="checkbox"
            checked={isSelected}
            onChange={() => {
              handleSelection(cartItem, !isSelected);
            }}
          />
      </div>

      <div className="item-div">
        <img src={"../" + cartItem.img_paths} alt="Book cover" />
      </div>
      
      <h4 className="item-container-product">{cartItem.name}</h4>
      <div className="quantity-div">
        <p>Quantity</p>
        <div className="select-quantity">
          <span>
            <button
              onClick={() => {
                changeQuantity(cartItem.book_id, "decrease");
              }}
              disabled={cartItem.quantity <= 1}
              className="quantity-btn minus-btn"
            >
              <i className="fas fa-minus-circle mx-2"></i>
            </button>
          </span>
          <p className="quantity">{cartItem.quantity}</p>
          <span>
            <button
              onClick={() => {
                changeQuantity(cartItem.book_id, "increase");
              }}
              className="quantity-btn plus-btn"
            >
              <i className="fas fa-plus-circle mx-2"></i>
            </button>
          </span>
        </div>
      </div>

      <div className="price-div">
        <p>Price</p>
        <p className="price">
          {cartItem.quantity} x {itemPrice} = {calculatedPrice} SGD
        </p>
      </div>

      <div className="remove-div">
        <button
          onClick={() => showDeleteModal(cartItem.book_id)}
          className="delete-item"
        >
          <i className="far fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
}

export default CartItem;
