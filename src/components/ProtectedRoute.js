import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
 
// Wrap any route that should only be visible to a logged-in admin.
// Usage: <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, authLoading } = useAuth();
 
  if (authLoading) {
    // Briefly shown while Firebase checks if a session already exists.
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh", backgroundColor: "#0A060D", color: "white" }}
      >
        Loading...
      </div>
    );
  }
 
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
 
  return children;
};
 
export default ProtectedRoute;
 