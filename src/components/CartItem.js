import React, { useState } from "react";

import { useCart } from "../context/CartContext";

function CartItem({ item }) {

  const {
    updateQuantity,
    removeFromCart
  } = useCart();

  const [updating, setUpdating] =
    useState(false);

  const product =
    item.productId ||
    item.product ||
    item;

  const itemId =
    item._id ||
    item.id;

  const name =
    product?.name ||
    item.name ||
    "Product";

  const image =
    product?.image ||
    item.image ||
    "https://via.placeholder.com/120x120?text=Product";

  const price =
    Number(
      product?.price ||
      item.price ||
      0
    );

  const quantity =
    Number(item.quantity || 1);

  const stock =
    Number(
      product?.stock ??
      item.stock ??
      Infinity
    );

  const itemTotal =
    price * quantity;

  const handleUpdate = async (
    newQuantity
  ) => {

    if (newQuantity < 1) {
      return;
    }

    if (
      stock !== Infinity &&
      newQuantity > stock
    ) {
      alert(
        `Only ${stock} items available in stock.`
      );

      return;
    }

    try {
      setUpdating(true);

      await updateQuantity(
        itemId,
        newQuantity
      );

    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async () => {
    await removeFromCart(itemId);
  };

  return (
    <div className="cart-item">

      <img
        src={image}
        alt={name}
        className="cart-item-image"
      />

      <div className="cart-item-info">

        <h3>
          {name}
        </h3>

        <p>
          Price: ₹{price}
        </p>

        <div className="quantity-controls">

          <button
            disabled={
              updating ||
              quantity <= 1
            }
            onClick={() =>
              handleUpdate(
                quantity - 1
              )
            }
          >
            −
          </button>

          <span>
            {quantity}
          </span>

          <button
            disabled={
              updating ||
              quantity >= stock
            }
            onClick={() =>
              handleUpdate(
                quantity + 1
              )
            }
          >
            +
          </button>

        </div>

        <p className="item-total">
          Item Total: ₹
          {itemTotal.toFixed(2)}
        </p>

        <button
          className="remove-btn"
          onClick={handleRemove}
          disabled={updating}
        >
          Remove
        </button>

      </div>

    </div>
  );
}

export default CartItem;