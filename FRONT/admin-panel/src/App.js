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
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { logoutUser } from "./services/logout";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get('access_token'))
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleAuthClick = () => {
    setIsSidebarOpen(true);
  };

  const handleLogoutClick = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {

      console.error('Ошибка при выходе:', error);
    }

    window.location.reload(); 
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogoClicked = () => {
    navigate("/");
  };

  const onAdminClicked = () => {
    navigate("/admin");
  };

  return (
    <div className="container">
      {showSplash ? (
        <SplashScreen />
      ) : (
        <>
          <Navbar onAuthClick={handleAuthClick} 
          isAuthenticated={isAuthenticated} 
          onLogoutClick={handleLogoutClick} 
          handleLogoClicked={handleLogoClicked} 
          onAdminClicked={onAdminClicked}
          />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/admin" element={isAuthenticated ? <AdminPanel /> : <Navigate to="/" replace />} />
          </Routes>
          <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} setIsAuthenticated={setIsAuthenticated}/>
          {/* Контейнер для уведомлений */}
          <ToastContainer position="top-right" autoClose={3000} />
        </>
      )}
    </div>
  );
}

export default App;
