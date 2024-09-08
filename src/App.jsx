import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard"; // You'll need to create this component
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hospitalName, setHospitalName] = useState('');
  const [uniqueId, setUniqueId] = useState('');

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route 
            path="/login" 
            element={
              <Login 
                setIsLoggedIn={setIsLoggedIn} 
                setHospitalName={setHospitalName} 
                setUniqueId={setUniqueId} 
              />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              isLoggedIn ? (
                <Dashboard 
                  hospitalName={hospitalName} 
                  uniqueId={uniqueId} 
                />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;