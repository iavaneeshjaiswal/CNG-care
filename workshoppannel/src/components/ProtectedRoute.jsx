import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { WorkshopContext } from "../context/contextapi";


const ProtectedRoute = ({ children }) => {
  const { state } = useContext(WorkshopContext);
  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
