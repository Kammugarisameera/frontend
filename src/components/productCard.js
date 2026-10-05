import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function ProductCard({ product }) {

  const { addToCart, adding } = useCart();
  const { isLoggedIn } = useAuth();

  const [message, setMessage] = useState("");

  const productId =
    product._id || product.id;

  const image =
    product.image ||
    "https://via.placeholder.com/500x400?text=Product";

  const stock =
    Number(product.stock) || 0;


  const handleAddToCart = async () => {

    setMessage("");

    if (!isLoggedIn) {
      setMessage("Please login first.");
      return;
    }

    const result =
      await addToCart(productId, 1);

    setMessage(
      result?.message ||
      "Product added to cart"
    );
  };


  return (
    <div className="product-card">

      {/* PRODUCT IMAGE */}

      <div className="product-image-wrapper">

        <img
          src={image}
          alt={product.name}
          className="product-image"
        />

        {stock <= 0 && (
          <span className="stock-badge out">
            Out of Stock
          </span>
        )}

        {stock > 0 && stock <= 5 && (
          <span className="stock-badge low">
            Only {stock} left
          </span>
        )}

      </div>


      {/* PRODUCT INFORMATION */}

      <div className="product-card-content">

        <span className="product-category">
          PRODUCT
        </span>

        <h3>
          {product.name}
        </h3>

        <div className="product-price">
          ₹{Number(product.price).toLocaleString("en-IN")}
        </div>

        <p className="product-description">
          {product.description
            ? product.description.substring(
                0,
                85
              )
            : "Quality product available at MyStore."}
        </p>

        <div className="product-stock">
          <span>Stock</span>
          <strong>
            {stock}
          </strong>
        </div>


        {/* BUTTONS */}

        <div className="product-buttons">

          <Link
            to={`/products/${productId}`}
            className="view-btn"
          >
            View Details
          </Link>


          <button
            className="add-cart-btn"
            disabled={
              stock <= 0 ||
              adding
            }
            onClick={handleAddToCart}
          >
            {stock <= 0
              ? "Out of Stock"
              : adding
              ? "Adding..."
              : "Add to Cart"}
          </button>

        </div>


        {message && (
          <div className="cart-message">
            {message}
          </div>
        )}

      </div>

    </div>
  );
}

export default ProductCard;