import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../conrext/AuthContext";

const PrivateRoute = () => {
  const { isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default PrivateRoute;
