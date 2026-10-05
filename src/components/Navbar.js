import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
    const { user, isLoggedIn, logoutUser } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const isAdmin =
        isLoggedIn && user?.role === "admin";

    const handleLogout = () => {
        logoutUser();
        navigate("/");
    };

    return (
        <nav className="navbar">

            {/* BRAND */}
            <div className="navbar-brand">

                <Link to={isAdmin ? "/admin" : "/"}>
                    MyStore
                </Link>

                {isAdmin && (
                    <span className="admin-badge">
                        Admin
                    </span>
                )}

            </div>


            {/* NAVIGATION */}
            <div className="navbar-links">

                {/* NORMAL USER */}
                {!isAdmin && (
                    <>
                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/products">
                            Products
                        </Link>

                        <Link to="/cart">
                            Cart ({cartCount})
                        </Link>

                        {isLoggedIn && (
                            <Link to="/orders">
                                My Orders
                            </Link>
                        )}
                    </>
                )}


                {/* ADMIN */}
                {isAdmin && (
                    <>
                        <Link to="/admin">
                            Dashboard
                        </Link>

                        <Link to="/admin/products">
                            Admin Products
                        </Link>

                        <Link to="/admin/categories">
                            Admin Categories
                        </Link>

                        <Link to="/admin/orders">
                            Orders
                        </Link>
                    </>
                )}


                {/* LOGIN / REGISTER / LOGOUT */}
                {!isLoggedIn ? (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                ) : (
                    <>
                        <span className="user-name">
                            Hi, {user?.name || user?.email}
                        </span>

                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;