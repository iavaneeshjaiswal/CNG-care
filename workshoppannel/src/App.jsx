import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import ProtectedRoute from "./components/ProtectedRoute";
import Services from "./pages/services";
import Approval from "./pages/Approval";
import Complete from "./pages/Complete";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Services />
            </ProtectedRoute>
          }
        />
        <Route
          path="/approval"
          element={
            <ProtectedRoute>
              <Approval />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complete"
          element={
            <ProtectedRoute>
              <Complete />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
