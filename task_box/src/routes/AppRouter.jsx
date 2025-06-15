import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../conrext/AuthContext";
import PrivateRoute from "../Private/PrivateRoute";
// Import your components
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Boardview from "../pages/Boardview";
import Layout from "../assests/components/Layout/Layout";

function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<PrivateRoute />}>
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/board/:boardId"
          element={
            <Layout>
              <Boardview />
            </Layout>
          }
        />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
