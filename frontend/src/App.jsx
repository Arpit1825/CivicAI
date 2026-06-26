import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AppProvider, useApp } from "./context/AppContext";

import Layout from "./components/Layout";
import Loader from "./components/Loader";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Citizen Pages
import Dashboard from "./pages/Dashboard";
import ReportIssue from "./pages/ReportIssue";
import MyRaisedIssues from "./pages/MyRaisedIssues";
import MySupportedIssues from "./pages/MySupportedIssues";
import MapView from "./pages/MapView";
import IssueDetails from "./pages/IssueDetails";

// Admin
import AdminDashboard from "./pages/AdminDashboard";

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && currentUser.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

const PublicRoute = ({ children }) => {
  const { currentUser } = useApp();

  if (currentUser) {
    return (
      <Navigate
        to={currentUser.role === "admin" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return children;
};

// 👇 New Component
function AppRoutes() {
  const { loading } = useApp();

  // Premium Loader
  if (loading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <Routes>

        {/* Landing */}
        <Route path="/" element={<Home />} />

        {/* Authentication */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />

        {/* Citizen */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-issue"
          element={
            <ProtectedRoute>
              <ReportIssue />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-raised"
          element={
            <ProtectedRoute>
              <MyRaisedIssues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-supported"
          element={
            <ProtectedRoute>
              <MySupportedIssues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nearby"
          element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/issue/:id"
          element={
            <ProtectedRoute>
              <IssueDetails />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;