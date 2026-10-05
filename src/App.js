import React from "react";

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./Pages/Home";
import Products from "./Pages/product";
import ProductDetails from "./Pages/productDetails";

import Login from "./Pages/Login";
import Register from "./Pages/Register";

import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import OrderConfirmation from "./Pages/OrderConfirmation";

// CUSTOMER ORDER PAGES
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";

// ADMIN PAGES
import AdminDashboard from "./Pages/AdminDashboard";
import AdminProducts from "./Pages/AdminProducts";
import AdminCategories from "./Pages/AdminCategories";
import AdminOrders from "./Pages/AdminOrders";
import AdminOrderDetails from "./Pages/AdminOrderDetails";

import ProtectedRoute from "./components/ProtectedRoute";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <AuthProvider>

        <CartProvider>

          <Navbar />

          <Routes>

            {/* =========================
                NORMAL USER PAGES
            ========================= */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/products/:id"
              element={<ProductDetails />}
            />


            {/* =========================
                AUTH PAGES
            ========================= */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />


            {/* =========================
                PROTECTED CART
            ========================= */}

            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />


            {/* =========================
                PROTECTED CHECKOUT
            ========================= */}

            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />


            {/* =========================
                ORDER CONFIRMATION
            ========================= */}

            <Route
              path="/order-confirmation/:orderId"
              element={
                <ProtectedRoute>
                  <OrderConfirmation />
                </ProtectedRoute>
              }
            />


            {/* =========================
                MY ORDERS
            ========================= */}

            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />


            {/* =========================
                ORDER DETAILS
            ========================= */}

            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />


            {/* =========================
                ADMIN DASHBOARD
            ========================= */}

            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />


            {/* =========================
                ADMIN PRODUCTS
            ========================= */}

            <Route
              path="/admin/products"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminProducts />
                </ProtectedRoute>
              }
            />


            {/* =========================
                ADMIN CATEGORIES
            ========================= */}

            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminCategories />
                </ProtectedRoute>
              }
            />


            {/* =========================
                ADMIN ORDERS
            ========================= */}

            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminOrders />
                </ProtectedRoute>
              }
            />


            {/* =========================
                ADMIN ORDER DETAILS
            ========================= */}

            <Route
              path="/admin/orders/:id"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminOrderDetails />
                </ProtectedRoute>
              }
            />


            {/* =========================
                404
            ========================= */}

            <Route
              path="*"
              element={
                <div className="not-found">

                  <div className="not-found-card">

                    <h1>404</h1>

                    <h2>
                      Page Not Found
                    </h2>

                    <p>
                      The page you are looking for
                      does not exist.
                    </p>

                    <a href="/">
                      Go Home
                    </a>

                  </div>

                </div>
              }
            />

          </Routes>

        </CartProvider>

      </AuthProvider>

    </BrowserRouter>
  );
}

export default App;