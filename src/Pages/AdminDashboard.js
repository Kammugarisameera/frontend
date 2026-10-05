import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

function AdminDashboard() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        setLoading(true);
        setError("");

        /*
         * Admin dashboard needs all orders.
         * Backend currently provides user-specific
         * order API, so this page first attempts
         * the general order endpoint.
         */

        const response = await fetch(
          `${API_URL}/order`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Failed to load orders"
          );
        }

        const orderList =
          data.orders ||
          data.data ||
          (Array.isArray(data) ? data : []);

        setOrders(
          Array.isArray(orderList)
            ? orderList
            : []
        );

      } catch (err) {

        setError(
          err.message ||
          "Failed to load dashboard"
        );

      } finally {

        setLoading(false);

      }

    };

    fetchOrders();

  }, []);


  const totalOrders = orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.status === "pending"
    ).length;

  const confirmedOrders =
    orders.filter(
      (order) =>
        order.status === "confirmed"
    ).length;

  const shippedOrders =
    orders.filter(
      (order) =>
        order.status === "shipped"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        order.status === "delivered"
    ).length;

  const cancelledOrders =
    orders.filter(
      (order) =>
        order.status === "cancelled"
    ).length;


  const totalSales =
    orders
      .filter(
        (order) =>
          order.status !== "cancelled"
      )
      .reduce(
        (total, order) =>
          total +
          Number(
            order.totalAmount || 0
          ),
        0
      );


  if (loading) {
    return (
      <div className="page-container">
        <h2>
          Loading Admin Dashboard...
        </h2>
      </div>
    );
  }


  return (
    <div className="page-container">

      <div className="admin-dashboard-header">

        <div>
          <h1>
            Admin Dashboard
          </h1>

          <p>
            Manage your MyStore application
          </p>
        </div>

        <Link
          to="/admin/orders"
          className="admin-action-btn"
        >
          View All Orders
        </Link>

      </div>


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Total Orders</h3>
          <strong>{totalOrders}</strong>
        </div>

        <div className="dashboard-card">
          <h3>Pending</h3>
          <strong>{pendingOrders}</strong>
        </div>

        <div className="dashboard-card">
          <h3>Confirmed</h3>
          <strong>{confirmedOrders}</strong>
        </div>

        <div className="dashboard-card">
          <h3>Shipped</h3>
          <strong>{shippedOrders}</strong>
        </div>

        <div className="dashboard-card">
          <h3>Delivered</h3>
          <strong>{deliveredOrders}</strong>
        </div>

        <div className="dashboard-card">
          <h3>Cancelled</h3>
          <strong>{cancelledOrders}</strong>
        </div>

      </div>


      <div className="dashboard-sales-card">

        <h2>
          Total Sales
        </h2>

        <p>
          ₹
          {totalSales.toLocaleString(
            "en-IN"
          )}
        </p>

      </div>


      <div className="admin-dashboard-actions">

        <Link to="/admin/products">
          Manage Products
        </Link>

        <Link to="/admin/categories">
          Manage Categories
        </Link>

        <Link to="/admin/orders">
          Manage Orders
        </Link>

      </div>

    </div>
  );
}

export default AdminDashboard;