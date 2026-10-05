import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const API_URL = "http://localhost:5000";

function Checkout() {
    const navigate = useNavigate();

    const { user } = useAuth();

    const {
        cartItems,
        cartTotal,
        clearCart,
        fetchCart
    } = useCart();

    const [form, setForm] = useState({
        fullName: user?.name || "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: ""
    });

    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);

    // ==========================================
    // FORM CHANGE
    // ==========================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setErrors((previous) => ({
            ...previous,
            [name]: ""
        }));

        setApiError("");
    };

    // ==========================================
    // VALIDATION
    // ==========================================

    const validateForm = () => {
        const newErrors = {};

        if (!form.fullName.trim()) {
            newErrors.fullName = "Full name is required.";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "Phone number is required.";
        } else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
            newErrors.phone = "Enter a valid 10-digit phone number.";
        }

        if (!form.address.trim()) {
            newErrors.address = "Address is required.";
        }

        if (!form.city.trim()) {
            newErrors.city = "City is required.";
        }

        if (!form.state.trim()) {
            newErrors.state = "State is required.";
        }

        if (!form.pincode.trim()) {
            newErrors.pincode = "Pincode is required.";
        } else if (!/^\d{6}$/.test(form.pincode.trim())) {
            newErrors.pincode = "Enter a valid 6-digit pincode.";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setApiError("Please fill all required fields correctly.");
            return false;
        }

        return true;
    };

    // ==========================================
    // PLACE ORDER
    // ==========================================

    const handlePlaceOrder = async (event) => {
        event.preventDefault();

        console.log("PLACE ORDER BUTTON CLICKED");

        if (loading) {
            return;
        }

        setApiError("");

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Check cart
        if (!cartItems || cartItems.length === 0) {
            setApiError("Your cart is empty.");
            return;
        }

        // Get user ID
        const userId =
            user?._id ||
            user?.id ||
            user?.userId ||
            localStorage.getItem("userId");

        console.log("USER ID:", userId);
        console.log("CART ITEMS:", cartItems);

        if (!userId) {
            setApiError(
                "User information not found. Please logout and login again."
            );
            return;
        }

        // Create one shipping address string
        const shippingAddress = [
            form.fullName,
            form.phone,
            form.address,
            form.city,
            form.state,
            form.pincode
        ]
            .map((value) => value.trim())
            .join(", ");

        console.log("SHIPPING ADDRESS:", shippingAddress);

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/order/create`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: userId,
                        shippingAddress: shippingAddress
                    })
                }
            );

            console.log("RESPONSE STATUS:", response.status);

            const contentType =
                response.headers.get("content-type") || "";

            const data = contentType.includes("application/json")
                ? await response.json()
                : {};

            console.log("BACKEND RESPONSE:", data);

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "Order creation failed."
                );
            }

            const createdOrder = data.order;

            if (!createdOrder || !createdOrder._id) {
                throw new Error(
                    "Order created but Order ID was not received."
                );
            }

            console.log(
                "ORDER CREATED SUCCESSFULLY:",
                createdOrder
            );

            // Backend already cleared cart
            clearCart();

            // Refresh frontend cart
            try {
                await fetchCart();
            } catch (cartError) {
                console.log(
                    "Cart refresh warning:",
                    cartError.message
                );
            }

            // Go to order confirmation
            navigate(
                `/order-confirmation/${createdOrder._id}`,
                {
                    state: {
                        order: createdOrder
                    }
                }
            );

        } catch (error) {
            console.error("PLACE ORDER ERROR:", error);

            setApiError(
                error.message ||
                "Something went wrong while placing the order."
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // EMPTY CART
    // ==========================================

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="checkout-page">

                <div className="empty-cart">

                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h2>
                        Your cart is empty
                    </h2>

                    <p>
                        Add products before going to checkout.
                    </p>

                    <button
                        className="primary-btn"
                        onClick={() => navigate("/products")}
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="checkout-page">

            <div className="page-heading">
                <span>CHECKOUT</span>
                <h1>Complete Your Order</h1>
            </div>

            {/* ERROR MESSAGE */}

            {apiError && (
                <div
                    className="checkout-error"
                    style={{
                        display: "block",
                        padding: "15px",
                        marginBottom: "20px",
                        background: "#ffe5e5",
                        color: "#c00000",
                        border: "1px solid #ffaaaa",
                        borderRadius: "8px",
                        fontWeight: "600"
                    }}
                >
                    {apiError}
                </div>
            )}

            <div className="checkout-layout">

                {/* =================================
                    LEFT SIDE
                ================================= */}

                <div className="checkout-main">

                    {/* ORDER REVIEW */}

                    <section className="checkout-card">

                        <div className="section-title">

                            <span>01</span>

                            <div>
                                <h2>Order Review</h2>

                                <p>
                                    Check your products before
                                    placing the order.
                                </p>
                            </div>

                        </div>

                        <div className="checkout-items">

                            {cartItems.map((item) => {

                                const product = item.productId;

                                const name =
                                    product?.name ||
                                    item.name ||
                                    "Product";

                                const price = Number(
                                    item.price ||
                                    product?.price ||
                                    0
                                );

                                const quantity = Number(
                                    item.quantity || 1
                                );

                                return (
                                    <div
                                        className="checkout-item"
                                        key={
                                            item._id ||
                                            product?._id ||
                                            Math.random()
                                        }
                                    >

                                        <div>
                                            <h3>
                                                {name}
                                            </h3>

                                            <p>
                                                ₹{price} × {quantity}
                                            </p>
                                        </div>

                                        <strong>
                                            ₹
                                            {(price * quantity).toFixed(2)}
                                        </strong>

                                    </div>
                                );
                            })}

                        </div>

                        <div className="checkout-total">

                            <span>
                                Total
                            </span>

                            <strong>
                                ₹{Number(cartTotal || 0).toFixed(2)}
                            </strong>

                        </div>

                    </section>

                    {/* DELIVERY FORM */}

                    <section className="checkout-card">

                        <div className="section-title">

                            <span>02</span>

                            <div>

                                <h2>
                                    Delivery Information
                                </h2>

                                <p>
                                    Enter your delivery details.
                                </p>

                            </div>

                        </div>

                        <form onSubmit={handlePlaceOrder}>

                            <div className="form-grid">

                                {/* FULL NAME */}

                                <div className="form-group">

                                    <label>
                                        Full Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="fullName"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                    />

                                    {errors.fullName && (
                                        <small>
                                            {errors.fullName}
                                        </small>
                                    )}

                                </div>

                                {/* PHONE */}

                                <div className="form-group">

                                    <label>
                                        Phone Number *
                                    </label>

                                    <input
                                        type="tel"
                                        name="phone"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="10-digit phone number"
                                        maxLength="10"
                                    />

                                    {errors.phone && (
                                        <small>
                                            {errors.phone}
                                        </small>
                                    )}

                                </div>

                                {/* ADDRESS */}

                                <div className="form-group full-width">

                                    <label>
                                        Address *
                                    </label>

                                    <textarea
                                        name="address"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="House number, street, area"
                                        rows="4"
                                    />

                                    {errors.address && (
                                        <small>
                                            {errors.address}
                                        </small>
                                    )}

                                </div>

                                {/* CITY */}

                                <div className="form-group">

                                    <label>
                                        City *
                                    </label>

                                    <input
                                        type="text"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                        placeholder="Enter city"
                                    />

                                    {errors.city && (
                                        <small>
                                            {errors.city}
                                        </small>
                                    )}

                                </div>

                                {/* STATE */}

                                <div className="form-group">

                                    <label>
                                        State *
                                    </label>

                                    <input
                                        type="text"
                                        name="state"
                                        value={form.state}
                                        onChange={handleChange}
                                        placeholder="Enter state"
                                    />

                                    {errors.state && (
                                        <small>
                                            {errors.state}
                                        </small>
                                    )}

                                </div>

                                {/* PINCODE */}

                                <div className="form-group">

                                    <label>
                                        Pincode *
                                    </label>

                                    <input
                                        type="text"
                                        name="pincode"
                                        value={form.pincode}
                                        onChange={handleChange}
                                        placeholder="6-digit pincode"
                                        maxLength="6"
                                    />

                                    {errors.pincode && (
                                        <small>
                                            {errors.pincode}
                                        </small>
                                    )}

                                </div>

                            </div>

                            {/* DELIVERY PREVIEW */}

                            <div className="delivery-preview">

                                <h3>
                                    Delivery Address
                                </h3>

                                <p>
                                    {form.fullName || "Full Name"}
                                </p>

                                <p>
                                    {form.phone || "Phone"}
                                </p>

                                <p>
                                    {form.address || "Address"}
                                </p>

                                <p>
                                    {form.city || "City"},{" "}
                                    {form.state || "State"}{" "}
                                    {form.pincode || ""}
                                </p>

                            </div>

                            {/* PLACE ORDER */}

                            <button
                                type="submit"
                                className="place-order-btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="button-spinner"></span>
                                        Placing Order...
                                    </>
                                ) : (
                                    <>
                                        Place Order
                                        <span>→</span>
                                    </>
                                )}
                            </button>

                            <p className="secure-note">
                                🔒 Your order will be confirmed
                                only after successful backend validation.
                            </p>

                        </form>

                    </section>

                </div>

                {/* =================================
                    RIGHT SIDE
                ================================= */}

                <aside className="checkout-sidebar">

                    <div className="sticky-summary">

                        <h2>
                            Order Summary
                        </h2>

                        <div className="summary-row">

                            <span>
                                Products
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
                                ₹{Number(cartTotal || 0).toFixed(2)}
                            </span>

                        </div>

                        <div className="summary-row">

                            <span>
                                Delivery
                            </span>

                            <span>
                                FREE
                            </span>

                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-total">

                            <span>
                                Order Total
                            </span>

                            <strong>
                                ₹{Number(cartTotal || 0).toFixed(2)}
                            </strong>

                        </div>

                        <div className="checkout-note">

                            <span>
                                ✓
                            </span>

                            <p>
                                No online payment is required
                                for this assignment.
                            </p>

                        </div>

                    </div>

                </aside>

            </div>

        </div>
    );
}

export default Checkout;