import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const API_URL = "http://localhost:5000";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/products/${id}`
        );

        const contentType =
          response.headers.get("content-type") || "";

        const data = contentType.includes("application/json")
          ? await response.json()
          : {};

        if (!response.ok) {
          throw new Error(
            data.message || "Product not found"
          );
        }

        const productData =
          data.product ||
          data.data ||
          data;

        setProduct(productData);
      } catch (error) {
        setError(
          error.message || "Unable to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="page-state">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page-state error">
        {error || "Product not found"}
      </div>
    );
  }

  const image =
    product.image ||
    "https://via.placeholder.com/500x500?text=Product";

  const stock = Number(product.stock || 0);

  const handleAddToCart = () => {
    addToCart(
      product._id || product.id,
      quantity
    );
  };

  return (
    <div className="product-details">

      <div>
        <img
          src={image}
          alt={product.name}
        />
      </div>

      <div className="product-details-content">

        <span className="details-label">
          PRODUCT DETAILS
        </span>

        <h1>{product.name}</h1>

        <div className="price">
          ₹{product.price}
        </div>

        <p>
          {product.description ||
            "No description available."}
        </p>

        <p>
          <strong>Available Stock:</strong>{" "}
          {stock}
        </p>

        {stock > 0 && (
          <div className="quantity-box">

            <button
              type="button"
              onClick={() =>
                setQuantity(
                  Math.max(1, quantity - 1)
                )
              }
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              type="button"
              onClick={() =>
                setQuantity(
                  Math.min(stock, quantity + 1)
                )
              }
            >
              +
            </button>

          </div>
        )}

        <button
          type="button"
          className="details-add-button"
          disabled={stock <= 0}
          onClick={handleAddToCart}
        >
          {stock <= 0
            ? "Out of Stock"
            : "Add to Cart"}
        </button>

        <Link
          to="/products"
          className="back-products"
        >
          ← Back to Products
        </Link>

      </div>
    </div>
  );
}

export default ProductDetails;