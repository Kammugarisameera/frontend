import React, {
  useEffect,
  useState
} from "react";

import {
  Link,
  useLocation,
  useParams
} from "react-router-dom";


function OrderConfirmation() {

  const {
    orderId
  } = useParams();


  const location =
    useLocation();


  const [order, setOrder] =
    useState(
      location.state?.order ||
      null
    );


  const [loading, setLoading] =
    useState(
      !location.state?.order
    );


  const [error, setError] =
    useState("");


  /*
   * ============================
   * FETCH ORDER
   * ============================
   *
   * Needed for browser refresh.
   */

  useEffect(() => {

    if (order) {
      return;
    }


    const fetchOrder = async () => {

      try {

        setLoading(true);


        const response =
          await fetch(
            `http://localhost:5000/order/${orderId}`
          );


        const contentType =
          response.headers.get(
            "content-type"
          ) || "";


        const data =
          contentType.includes(
            "application/json"
          )
            ? await response.json()
            : {};


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load order."
          );

        }


        setOrder(
          data.order
        );


      } catch (err) {

        setError(
          err.message ||
          "Failed to load order."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchOrder();

  }, [
    order,
    orderId
  ]);


  if (loading) {

    return (

      <div className="page-loader">

        <div className="loader"></div>

        <p>
          Loading order...
        </p>

      </div>

    );

  }


  if (error) {

    return (

      <div className="confirmation-page">

        <div className="confirmation-card">

          <div className="failure-icon">
            !
          </div>

          <h1>
            Unable to Load Order
          </h1>

          <p>
            {error}
          </p>

          <Link
            to="/products"
            className="primary-btn"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    );

  }


  if (!order) {

    return (

      <div className="confirmation-page">

        <div className="confirmation-card">

          <h1>
            Order Not Found
          </h1>

          <Link
            to="/products"
            className="primary-btn"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    );

  }


  return (

    <div className="confirmation-page">

      <div className="confirmation-card">

        {/* SUCCESS ICON */}

        <div className="success-icon">
          ✓
        </div>


        <span className="success-label">
          ORDER SUCCESSFUL
        </span>


        <h1>
          Thank You For Your Order!
        </h1>


        <p className="confirmation-text">

          Your order has been
          successfully placed.

        </p>


        {/* ORDER ID */}

        <div className="order-id-box">

          <span>
            Order ID
          </span>

          <strong>
            {order._id}
          </strong>

        </div>


        {/* ORDER INFORMATION */}

        <div className="confirmation-details">

          <div>

            <span>
              Status
            </span>

            <strong className="status-badge">
              {order.status}
            </strong>

          </div>


          <div>

            <span>
              Order Total
            </span>

            <strong>
              ₹
              {Number(
                order.totalAmount || 0
              ).toFixed(2)}
            </strong>

          </div>


          <div>

            <span>
              Items
            </span>

            <strong>
              {order.items?.length || 0}
            </strong>

          </div>

        </div>


        {/* ITEMS */}

        {order.items?.length > 0 && (

          <div className="confirmed-items">

            <h2>
              Ordered Products
            </h2>


            {order.items.map(
              (item, index) => (

                <div
                  className="confirmed-item"
                  key={
                    item.productId ||
                    index
                  }
                >

                  <div>

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      ₹{item.price} ×{" "}
                      {item.quantity}
                    </span>

                  </div>


                  <strong>
                    ₹
                    {Number(
                      item.total || 0
                    ).toFixed(2)}
                  </strong>

                </div>

              )
            )}

          </div>

        )}


        {/* DELIVERY */}

        {order.shippingAddress && (

          <div className="confirmed-address">

            <h2>
              Delivery Address
            </h2>

            <p>
              {order.shippingAddress}
            </p>

          </div>

        )}


        {/* BUTTON */}

        <Link
          to="/products"
          className="primary-btn confirmation-btn"
        >
          Continue Shopping
        </Link>

      </div>

    </div>

  );

}

export default OrderConfirmation;