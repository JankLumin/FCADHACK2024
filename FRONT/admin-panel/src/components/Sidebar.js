// src/components/Sidebar.js

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import "../styles/sidebar.css";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function Sidebar({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "100%" },
  };

  return (
    <motion.div
      className="sidebar-overlay"
      initial="closed"
      onClick={onClose} 
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ type: "tween", duration: 0.3 }}
    >
      <motion.div
        className="sidebar"
        initial={{ x: "100%" }}
        animate={isOpen ? { x: 0 } : { x: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        onClick={(e) => e.stopPropagation()} 
      >
        <button className="close-button" onClick={onClose}>
          <FiX size={24} />
        </button>
        {isLogin ? (
          <LoginForm onSwitch={toggleForm} onClose={onClose} />
        ) : (
          <RegisterForm onSwitch={toggleForm} onClose={onClose} />
        )}
      </motion.div>
    </motion.div>
  );
}

export default Sidebar;
