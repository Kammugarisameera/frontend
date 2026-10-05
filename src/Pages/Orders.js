import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:5000";

function Orders() {
    const { user } = useAuth();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // GET USER ID
    // ==========================================

    const getUserId = () => {
        return (
            user?._id ||
            user?.id ||
            user?.userId ||
            localStorage.getItem("userId")
        );
    };

    // ==========================================
    // FETCH USER ORDERS
    // ==========================================

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const userId = getUserId();

            if (!userId) {
                throw new Error(
                    "User ID not found. Please login again."
                );
            }

            const response = await fetch(
                `${API_URL}/order/user/${userId}`
            );

            const contentType =
                response.headers.get("content-type") || "";

            const data = contentType.includes("application/json")
                ? await response.json()
                : await response.text();

            if (!response.ok) {
                throw new Error(
                    typeof data === "object"
                        ? data.message || "Failed to fetch orders"
                        : data || "Failed to fetch orders"
                );
            }

            const orderList =
                data.orders ||
                data.data ||
                [];

            setOrders(
                Array.isArray(orderList)
                    ? orderList
                    : []
            );

        } catch (err) {
            console.error("MY ORDERS ERROR:", err);

            setError(
                err.message || "Failed to fetch orders"
            );
        } finally {
            setLoading(false);
        }
    }, [user]);

    // ==========================================
    // LOAD ORDERS
    // ==========================================

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="page-container">
                <h2>My Orders</h2>
                <p>Loading orders...</p>
            </div>
        );
    }

    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="page-container">

            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="admin-orders-header">

                <div>
                    <h1>My Orders</h1>

                    <p>
                        View all your previous orders.
                    </p>
                </div>

                <Link
                    to="/products"
                    className="admin-action-btn"
                >
                    Continue Shopping
                </Link>

            </div>

            {/* ==========================================
                ERROR
            ========================================== */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* ==========================================
                NO ORDERS
            ========================================== */}

            {!error && orders.length === 0 && (
                <div className="empty-orders">

                    <h2>No Orders Found</h2>

                    <p>
                        You have not placed any orders yet.
                    </p>

                    <Link
                        to="/products"
                        className="back-btn"
                    >
                        Start Shopping
                    </Link>

                </div>
            )}

            {/* ==========================================
                ORDERS LIST
            ========================================== */}

            {orders.length > 0 && (
                <div className="my-orders-list">

                    {orders.map((order) => (

                        <div
                            className="my-order-card"
                            key={order._id}
                        >

                            {/* ==========================================
                                ORDER HEADER
                            ========================================== */}

                            <div className="my-order-header">

                                <div>

                                    <p>
                                        <strong>
                                            Order Date:
                                        </strong>{" "}

                                        {order.createdAt
                                            ? new Date(
                                                order.createdAt
                                            ).toLocaleDateString()
                                            : "N/A"}
                                    </p>

                                </div>

                                {/* STATUS */}

                                <div className="order-status-box">

                                    <span
                                        className={`order-status ${
                                            order.status || "pending"
                                        }`}
                                    >
                                        {order.status || "pending"}
                                    </span>

                                </div>

                            </div>

                            {/* ==========================================
                                ORDER ITEMS
                            ========================================== */}

                            {Array.isArray(order.items) &&
                            order.items.length > 0 ? (

                                <div className="ordered-products">

                                    {order.items.map(
                                        (item, index) => {

                                            // Product image
                                            const image =
                                                item.image ||
                                                item.productId?.image ||
                                                "https://via.placeholder.com/120";

                                            return (

                                                <div
                                                    className="ordered-product"
                                                    key={
                                                        item.productId?._id ||
                                                        index
                                                    }
                                                >

                                                    {/* ==========================================
                                                        PRODUCT IMAGE
                                                    ========================================== */}

                                                    <div className="ordered-product-image">

                                                        <img
                                                            src={image}
                                                            alt={
                                                                item.name ||
                                                                "Product"
                                                            }
                                                        />

                                                    </div>

                                                    {/* ==========================================
                                                        PRODUCT INFORMATION
                                                    ========================================== */}

                                                    <div className="ordered-product-info">

                                                        <h3>
                                                            {item.name ||
                                                                "Product"}
                                                        </h3>

                                                        {/* QUANTITY */}

                                                        <p>
                                                            <strong>
                                                                Quantity:
                                                            </strong>{" "}
                                                            {item.quantity || 0}
                                                        </p>

                                                        {/* PRICE */}

                                                        <p>
                                                            <strong>
                                                                Price:
                                                            </strong>{" "}
                                                            ₹
                                                            {Number(
                                                                item.price || 0
                                                            ).toFixed(2)}
                                                        </p>

                                                    </div>

                                                    {/* ==========================================
                                                        ITEM TOTAL
                                                    ========================================== */}

                                                    <div className="ordered-product-total">

                                                        <strong>
                                                            ₹
                                                            {Number(
                                                                item.total || 0
                                                            ).toFixed(2)}
                                                        </strong>

                                                    </div>

                                                </div>
                                            );
                                        }
                                    )}

                                </div>

                            ) : (

                                /* ==========================================
                                    NO ITEMS
                                ========================================== */

                                <div className="no-order-items">

                                    <h3>
                                        No items in this order.
                                    </h3>

                                    <p>
                                        This order does not contain
                                        any products.
                                    </p>

                                </div>
                            )}

                            {/* ==========================================
                                ORDER FOOTER
                            ========================================== */}

                            <div className="my-order-footer">

                                {/* TOTAL */}

                                <div>

                                    <span>
                                        Total Amount
                                    </span>

                                    <strong>
                                        ₹
                                        {Number(
                                            order.totalAmount || 0
                                        ).toFixed(2)}
                                    </strong>

                                </div>

                                {/* VIEW DETAILS */}

                                <Link
                                    to={`/orders/${order._id}`}
                                    className="view-order-btn"
                                >
                                    View Details
                                </Link>

                            </div>

                        </div>

                    ))}

                </div>
            )}

        </div>
    );
}

export default Orders;