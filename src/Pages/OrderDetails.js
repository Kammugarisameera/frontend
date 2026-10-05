import React, {
  useCallback,
  useEffect,
  useState
} from "react";

import {
  Link,
  useParams
} from "react-router-dom";

const API_URL = "http://localhost:5000";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/order/${id}`
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : {};

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch order"
        );
      }

      setOrder(
        data.order ||
        data.data ||
        data
      );
    } catch (err) {
      setError(
        err.message || "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id, fetchOrder]);

  if (loading) {
    return (
      <div className="page-container">
        <h2>Order Details</h2>
        <p>Loading order...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          {error}
        </div>

        <Link
          to="/orders"
          className="back-btn"
        >
          Back to My Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-container">
        <div className="empty-orders">
          <h2>Order Not Found</h2>

          <Link
            to="/orders"
            className="back-btn"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="order-details-card">

        <div className="order-header">
          <div>
            <h2>
              Order Details
            </h2>

            <p>
              Order ID: {order._id}
            </p>

            <p>
              Date:{" "}
              {order.createdAt
                ? new Date(
                    order.createdAt
                  ).toLocaleString()
                : "N/A"}
            </p>
          </div>

          <span className="order-status">
            {order.status || "pending"}
          </span>
        </div>

        <div>
          <h3>Ordered Items</h3>

          {Array.isArray(order.items) &&
            order.items.map((item, index) => (
              <div
                className="order-item"
                key={
                  item.productId ||
                  index
                }
              >
                <div>
                  <h4>
                    {item.name ||
                      "Product"}
                  </h4>

                  <p>
                    Quantity:{" "}
                    {item.quantity}
                  </p>

                  <p>
                    Price: ₹
                    {Number(
                      item.price || 0
                    ).toFixed(2)}
                  </p>
                </div>

                <strong>
                  Total: ₹
                  {Number(
                    item.total || 0
                  ).toFixed(2)}
                </strong>
              </div>
            ))}
        </div>

        <div className="order-total">
          <strong>
            Total Amount
          </strong>

          <strong>
            ₹
            {Number(
              order.totalAmount || 0
            ).toFixed(2)}
          </strong>
        </div>

        <div className="shipping-address">
          <h3>
            Shipping Address
          </h3>

          <p>
            {order.shippingAddress ||
              "No shipping address available"}
          </p>
        </div>

        <Link
          to="/orders"
          className="back-btn"
        >
          Back to My Orders
        </Link>
      </div>
    </div>
  );
}

export default OrderDetails;