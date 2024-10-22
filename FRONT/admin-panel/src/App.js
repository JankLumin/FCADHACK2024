// src/App.js

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import SplashScreen from "./components/SplashScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/app.css";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAuthClick = () => {
    setIsSidebarOpen(true);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("token"); // Удаляем токен
    window.location.reload(); // Перезагружаем страницу, чтобы обновить состояние
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  //const isAuthenticated = !!localStorage.getItem("token");
  const isAuthenticated = true;

  return (
    <div className="container">
      {showSplash ? (
        <SplashScreen />
      ) : (
        <>
          <Navbar onAuthClick={handleAuthClick} isAuthenticated={isAuthenticated} onLogoutClick={handleLogoutClick} />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/admin" element={isAuthenticated ? <AdminPanel /> : <Navigate to="/" replace />} />
          </Routes>
          <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
          {/* Контейнер для уведомлений */}
          <ToastContainer position="top-right" autoClose={3000} />
        </>
      )}
    </div>
  );
}

export default App;
