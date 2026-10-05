import React from "react";

import {
  Navigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
  adminOnly = false
}) {

  const {
    user,
    isLoggedIn
  } = useAuth();


  // Not logged in
  if (!isLoggedIn) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // Admin-only page
  if (
    adminOnly &&
    user?.role !== "admin"
  ) {

    return (
      <Navigate
        to="/"
        replace
      />
    );

  }


  return children;
}

export default ProtectedRoute;