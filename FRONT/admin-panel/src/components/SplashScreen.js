// src/components/SplashScreen.js

import React from "react";
import { motion } from "framer-motion";
import "../styles/splashScreen.css";

function SplashScreen() {
  return (
    <div className="splash-screen">
      <motion.h1
        className="splash-text"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 1 }}
      >
        FCADHACK 2024
      </motion.h1>
    </div>
  );
}

export default SplashScreen;
