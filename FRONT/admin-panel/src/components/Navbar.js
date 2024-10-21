// src/components/Navbar.js

import React from "react";
import { FiLogIn } from "react-icons/fi";
import { motion } from "framer-motion";
import "../styles/navbar.css";

function Navbar({ onAuthClick }) {
  return (
    <nav className="navbar">
      <h1 className="logo">FCADHACK 2024</h1>
      <div className="nav-buttons">
        <motion.button
          className="nav-button"
          onClick={onAuthClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiLogIn size={20} />
          Войти/Зарегистрироваться
        </motion.button>
      </div>
    </nav>
  );
}

export default Navbar;
