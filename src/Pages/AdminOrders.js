import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000";

function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/order`
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to fetch orders"
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

            console.error(
                "ADMIN ORDERS ERROR:",
                err
            );

            setError(
                err.message ||
                "Failed to fetch orders"
            );

        } finally {

            setLoading(false);

        }

    }, []);


    useEffect(() => {

        fetchOrders();

    }, [fetchOrders]);


    return (
        <div className="page-container">

            {/* HEADER */}
            <div className="admin-orders-header">

                <div>

                    <h1>
                        Admin Orders
                    </h1>

                    <p>
                        Manage all customer orders.
                    </p>

                </div>


                <button
                    className="admin-action-btn"
                    onClick={fetchOrders}
                >
                    Refresh
                </button>

            </div>


            {/* LOADING */}
            {loading && (
                <div className="empty-orders">

                    <h2>
                        Loading Orders...
                    </h2>

                    <p>
                        Please wait.
                    </p>

                </div>
            )}


            {/* ERROR */}
            {!loading && error && (
                <div className="error-message">

                    {error}

                </div>
            )}


            {/* NO ORDERS */}
            {!loading &&
                !error &&
                orders.length === 0 && (

                    <div className="empty-orders">

                        <h2>
                            No Orders Found
                        </h2>

                        <p>
                            There are no customer
                            orders yet.
                        </p>

                    </div>
                )
            }


            {/* ORDERS */}
            {!loading &&
                !error &&
                orders.length > 0 && (

                    <div className="admin-orders-list">

                        {orders.map((order) => (

                            <div
                                className="admin-order-card"
                                key={order._id}
                            >

                                {/* ORDER INFORMATION */}
                                <div className="admin-order-info">

                                    <h3>
                                        Order #{order._id}
                                    </h3>

                                    <p>
                                        <strong>
                                            Customer:
                                        </strong>{" "}

                                        {order.userId?.name ||
                                            order.userId?.email ||
                                            "Unknown"}
                                    </p>

                                    <p>
                                        <strong>
                                            Date:
                                        </strong>{" "}

                                        {order.createdAt
                                            ? new Date(
                                                order.createdAt
                                            ).toLocaleString()
                                            : "N/A"}
                                    </p>

                                </div>


                                {/* TOTAL + STATUS */}
                                <div className="admin-order-summary">

                                    <p className="admin-order-total">

                                        <strong>
                                            Total:
                                        </strong>{" "}

                                        ₹
                                        {Number(
                                            order.totalAmount || 0
                                        ).toFixed(2)}

                                    </p>


                                    <span className="order-status">

                                        {order.status ||
                                            "pending"}

                                    </span>

                                </div>


                                {/* VIEW DETAILS */}
                                <div className="admin-order-action">

                                    <Link
                                        to={`/admin/orders/${order._id}`}
                                        className="view-order-btn"
                                    >
                                        View Details
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>
                )
            }

        </div>
    );
}

export default AdminOrders;