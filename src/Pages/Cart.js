import React from "react";

import {
  Link
} from "react-router-dom";

import {
  useCart
} from "../context/CartContext";


function Cart() {

  const {
    cartItems,
    cartTotal,
    loading,
    error,
    updateCartItem,
    removeCartItem,
    clearCart
  } = useCart();


  if (loading) {

    return (

      <div className="page-loader">

        <div className="loader"></div>

        <p>Loading cart...</p>

      </div>

    );

  }


  return (

    <div className="cart-page">

      <div className="page-heading">

        <span>
          YOUR SHOPPING BAG
        </span>

        <h1>
          Shopping Cart
        </h1>

      </div>


      {error && (

        <div className="error-message">
          {error}
        </div>

      )}


      {cartItems.length === 0 ? (

        <div className="empty-cart">

          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add some products to
            your cart and come back.
          </p>

          <Link
            to="/products"
            className="primary-btn"
          >
            Continue Shopping
          </Link>

        </div>

      ) : (

        <div className="cart-layout">

          {/* CART ITEMS */}

          <div className="cart-items-section">

            {cartItems.map(
              (item) => {

                const product =
                  item.productId;

                const productId =
                  product?._id ||
                  product?.id ||
                  item.productId;

                const image =
                  product?.image ||
                  item.image ||
                  "https://via.placeholder.com/120";


                const price =
                  Number(
                    item.price ||
                    product?.price ||
                    0
                  );


                const quantity =
                  Number(
                    item.quantity || 1
                  );


                return (

                  <div
                    className="cart-item-card"
                    key={
                      item._id ||
                      productId
                    }
                  >

                    <img
                      src={image}
                      alt={
                        product?.name ||
                        item.name ||
                        "Product"
                      }
                    />


                    <div className="cart-item-info">

                      <h3>
                        {product?.name ||
                          item.name ||
                          "Product"}
                      </h3>

                      <p>
                        ₹{price}
                      </p>


                      <div className="quantity-box">

                        <button
                          onClick={() =>
                            updateCartItem(
                              item._id,
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
                          onClick={() =>
                            updateCartItem(
                              item._id,
                              quantity + 1
                            )
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>


                    <div className="cart-item-right">

                      <strong>
                        ₹
                        {(
                          price *
                          quantity
                        ).toFixed(2)}
                      </strong>

                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeCartItem(
                            item._id
                          )
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                );

              }
            )}


            <button
              className="clear-cart-btn"
              onClick={clearCart}
            >
              Clear Cart
            </button>

          </div>


          {/* SUMMARY */}

          <div className="cart-summary">

            <h2>
              Order Summary
            </h2>

            <div className="summary-row">

              <span>
                Items
              </span>

              <span>
                {cartItems.length}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <span>
                ₹{cartTotal.toFixed(2)}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Delivery
              </span>

              <span>
                Free
              </span>

            </div>


            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>
                ₹{cartTotal.toFixed(2)}
              </strong>

            </div>


            <Link
              to="/checkout"
              className="checkout-btn"
            >
              Proceed to Checkout
            </Link>

          </div>

        </div>

      )}

    </div>

  );

}

export default Cart;