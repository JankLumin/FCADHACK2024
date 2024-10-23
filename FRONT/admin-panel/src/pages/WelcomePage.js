// src/pages/WelcomePage.js

import React from "react";
import { motion } from "framer-motion";
import { FaReact, FaJs, FaPython, FaDatabase, FaShieldAlt, FaDocker, FaHtml5, FaCss3Alt } from "react-icons/fa";
import { MdManageSearch } from "react-icons/md";
import { SiDjango } from "react-icons/si";
import "../styles/app.css";

function WelcomePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <motion.div
      className="welcome-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 1 }}
    >
      <motion.h1 variants={itemVariants}>FCADHACK 2024</motion.h1>
      <motion.h2 variants={itemVariants}>Разработка Proxy-сервиса сквозной фильтрации и маскирования ЧД/ПД</motion.h2>
      <motion.p className="description" variants={itemVariants}>
        Команда OstoCity пред
      </motion.p>

      <motion.div className="tech-stack" variants={itemVariants}>
        <h3>Используемые технологии</h3>
        <div className="tech-icons">
          <motion.div
            className="tech-icon"
            variants={itemVariants}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaJs size={50} color="#f0db4f" />
            <p>JavaScript</p>
          </motion.div>
          <motion.div
            className="tech-icon"
            variants={itemVariants}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaHtml5 size={50} color="#ffa742" />
            <p>Html</p>
          </motion.div>
          <motion.div
            className="tech-icon"
            variants={itemVariants}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaCss3Alt size={50} color="#2e57e8" />
            <p>CSS</p>
          </motion.div>
          <motion.div
            className="tech-icon"
            variants={itemVariants}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaReact size={50} color="#61DBFB" />
            <p>React</p>
          </motion.div>
          <motion.div
            className="tech-icon"
            variants={itemVariants}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaPython size={50} color="#4b8bbe" />
            <p>Python</p>
          </motion.div>
          <motion.div
            className="tech-icon"
            variants={itemVariants}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <SiDjango size={50} color="#2e5c49" />
            <p>Django</p>
          </motion.div>
          <motion.div
            className="tech-icon"
            variants={itemVariants}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaDatabase size={50} color="#00BFFF" />
            <p>PostgreSQL</p>
          </motion.div>
          <motion.div
            className="tech-icon"
            variants={itemVariants}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaShieldAlt size={50} color="#e74c3c" />
            <p>HTTP Proxy</p>
          </motion.div>
          <motion.div
            className="tech-icon"
            variants={itemVariants}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaDocker size={50} color="#8243D6" />
            <p>Docker</p>
          </motion.div>
          <motion.div
            className="tech-icon"
            variants={itemVariants}
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <MdManageSearch size={50} color="#57de18" />
            <p>Regular Expressions</p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="features" variants={itemVariants}>
        <h3>Основные возможности</h3>
        <ul>
          <li>Инновационные проекты и задачи</li>
          <li>Работа в командах и развитие навыков</li>
          <li>Призы и награды для лучших команд</li>
          <li>Возможность взаимодействия с менторами и экспертами</li>
          <li>Сетевое взаимодействие и нетворкинг</li>
        </ul>
      </motion.div>
    </motion.div>
  );
}

export default WelcomePage;
