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

function AdminOrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const statuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
    "cancelled"
  ];

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
          data.message ||
          "Failed to fetch order"
        );
      }

      setOrder(
        data.order ||
        data.data ||
        data
      );
    } catch (err) {
      setError(
        err.message ||
        "Failed to load order"
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

  const updateStatus = async (status) => {
    try {
      setUpdating(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/order/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            status
          })
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : {};

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to update status"
        );
      }

      setOrder(
        data.order ||
        data.data ||
        data
      );

      setMessage(
        "Order status updated successfully."
      );

      await fetchOrder();
    } catch (err) {
      setError(
        err.message ||
        "Failed to update status"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2>Admin Order Details</h2>
        <p>Loading order...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="page-container">
        <div className="error-message">
          {error}
        </div>

        <Link
          to="/admin/orders"
          className="back-btn"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page-container">
        <h2>Order not found</h2>

        <Link
          to="/admin/orders"
          className="back-btn"
        >
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container">

      <div className="admin-order-details-header">
        <div>
          <h1>
            Admin Order Details
          </h1>

          <p>
            Order ID: {order._id}
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="admin-action-btn"
        >
          Back to Orders
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      <div className="order-details-card">

        <div className="order-header">
          <div>
            <h2>
              Order #{order._id}
            </h2>

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
            {order.status}
          </span>
        </div>

        <div className="admin-customer-info">
          <h3>
            Customer Information
          </h3>

          <p>
            User ID:{" "}
            {order.userId?._id ||
              order.userId ||
              "N/A"}
          </p>

          {order.userId?.name && (
            <p>
              Name: {order.userId.name}
            </p>
          )}

          {order.userId?.email && (
            <p>
              Email: {order.userId.email}
            </p>
          )}
        </div>

        <div>
          <h3>
            Ordered Items
          </h3>

          {Array.isArray(order.items) &&
            order.items.map(
              (item, index) => (
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
                    ₹
                    {Number(
                      item.total || 0
                    ).toFixed(2)}
                  </strong>
                </div>
              )
            )}
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
              "No address available"}
          </p>
        </div>

        <div className="status-update-section">
          <h3>
            Update Order Status
          </h3>

          <div className="status-buttons">
            {statuses.map(
              (status) => (
                <button
                  key={status}
                  disabled={
                    updating ||
                    order.status ===
                      status
                  }
                  onClick={() =>
                    updateStatus(
                      status
                    )
                  }
                >
                  {status
                    .charAt(0)
                    .toUpperCase() +
                    status.slice(1)}
                </button>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminOrderDetails;