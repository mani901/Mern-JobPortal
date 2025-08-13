import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "../LoadingSpinner";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return <LoadingSpinner />;
  }

  // If user is authenticated, redirect to dashboard/home
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // User is not authenticated, show the public page
  return children;
};

export default PublicRoute;
