// src/pages/AdminPanel.js

import React, { useState, useRef } from "react";
import { updateSettings } from "../services/admin";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaMask, FaTrash, FaFilter, FaTimes } from "react-icons/fa"; // Импортируем иконки
import "../styles/adminPanel.css";

function AdminPanel() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Инициализируем все поля как "none" по умолчанию
  const [settings, setSettings] = useState({
    account: {
      Email: "none",
      Endpoint: "none",
      "Номер телефона": "none",
      Логин: "none",
      Пароль: "none",
      Timestamp: "none",
      Message: "none",
      SupportLevel: "none",
      UserID: "none",
    },
    passport: {
      Фамилия: "none",
      Имя: "none",
      Отчество: "none",
      "Дата рождения": "none",
      Пол: "none",
      Возраст: "none",
      "Адрес прописки": "none",
      "Серия и номер паспорта": "none",
      "Код подразделения": "none",
      "Кем выдан": "none",
    },
    location: {
      Страна: "none",
      Регион: "none",
      Город: "none",
      Улица: "none",
      "Номер дома": "none",
    },
    bank: {
      "номер счета": "none",
      "Имя владельца карты": "none",
      "Номер кредитной карты": "none",
      "Срок действия карты": "none",
    },
    study: {
      Специальность: "none",
      Направление: "none",
      "Учебное заведение": "none",
      "Серия/Номер диплома": "none",
      "Регистрационный номер": "none",
    },
  });

  // useRef для хранения экземпляра WebSocket
  const socketRef = useRef(null);

  // Новое состояние для отслеживания подключения
  const [isConnected, setIsConnected] = useState(false);

  // Состояния для пагинации
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Функция для инициализации WebSocket-соединения
  const initializeWebSocket = () => {
    // Если соединение уже существует, не создаем новое
    if (socketRef.current) {
      console.log("WebSocket уже подключен");
      toast.info("WebSocket уже подключен");
      return;
    }

    // Устанавливаем статус загрузки
    setLoading(true);
    setError("");

    // Создаем новое WebSocket-соединение
    const socket = new WebSocket("ws://127.0.0.1:8001/ws/send-user-data/");

    // Сохраняем экземпляр WebSocket в ref
    socketRef.current = socket;

    // Обработчик открытия соединения
    socket.onopen = () => {
      console.log("WebSocket connection established");
      toast.success("Соединение WebSocket установлено");
      setIsConnected(true); // Обновляем состояние подключения

      // Отправляем команду на сервер для начала передачи данных
      socket.send(JSON.stringify({ command: "start sending user data" }));
    };

    // Обработчик получения сообщений
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received data:", data);

        // Предполагается, что сервер отправляет массив пользователей
        if (Array.isArray(data)) {
          setUserData(data);
        } else {
          // Если сервер отправляет объект с данными пользователя
          setUserData((prevData) => [...prevData, data]);
        }
        setLoading(false);
      } catch (parseError) {
        console.error("Error parsing WebSocket data:", parseError);
        setError("Ошибка при обработке полученных данных");
        setLoading(false);
      }
    };

    // Обработчик ошибок WebSocket
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("WebSocket error");
      setLoading(false);
      toast.error("Произошла ошибка WebSocket");
    };

    // Обработчик закрытия соединения
    socket.onclose = (event) => {
      console.log("WebSocket closed with code:", event.code);
      if (event.code !== 1000) {
        setError(`WebSocket закрыт неожиданно. Код: ${event.code}`);
        toast.error(`WebSocket закрыт с ошибкой. Код: ${event.code}`);
      }
      setIsConnected(false); // Обновляем состояние подключения

      // Очистка ref при закрытии соединения
      socketRef.current = null;
    };
  };

  // Функция для отключения WebSocket-соединения
  const closeWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close(1000, "User disconnected");
      socketRef.current = null;
      setIsConnected(false); // Обновляем состояние подключения
      toast.info("WebSocket соединение закрыто");
    } else {
      toast.info("WebSocket не подключен");
    }
  };

  // Обновлённая функция обработки изменений радиокнопок
  const handleRadioChange = (category, field, value) => {
    setSettings((prevSettings) => {
      const currentValue = prevSettings[category][field];
      const newValue = currentValue === value ? "none" : value; // Позволяем отменить выбор и вернуть "none"

      return {
        ...prevSettings,
        [category]: {
          ...prevSettings[category],
          [field]: newValue,
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Собираем выбранные поля по действиям
    const mask = [];
    const deleteFields = [];
    const filter = [];

    const categories = ["account", "passport", "location", "bank", "study"];

    categories.forEach((category) => {
      Object.keys(settings[category]).forEach((field) => {
        const action = settings[category][field];
        if (action === "mask") {
          mask.push(field);
        } else if (action === "delete") {
          deleteFields.push(field);
        } else if (action === "filter") {
          filter.push(field);
        }
        // Если action === "none", не добавляем поле
      });
    });

    const payload = {
      mask,
      delete: deleteFields,
      filter,
    };

    // Логируем отправляемые настройки для проверки
    console.log("Отправляемые поля и действия:", payload);

    try {
      await updateSettings(payload);
      toast.success("Настройки успешно сохранены!");
    } catch (err) {
      toast.error(`Ошибка: ${err.message}`);
      console.error("Ошибка при обновлении настроек:", err);
    }
  };

  // Функция для безопасного отображения данных
  const displayData = (data) => {
    if (data === null || data === undefined || data === "None") return "—";
    return data;
  };

  // Функция для получения всех уникальных ключей из данных, за исключением скрытых
  const getDisplayedKeys = () => {
    const hiddenFields = new Set();
    // Добавляем все скрытые поля из settings
    Object.keys(settings).forEach((category) => {
      Object.keys(settings[category]).forEach((field) => {
        if (settings[category][field] === "mask" || settings[category][field] === "delete") {
          hiddenFields.add(field);
        }
      });
    });

    const keys = new Set();
    userData.forEach((item) => {
      Object.keys(item).forEach((key) => {
        if (!hiddenFields.has(key)) {
          keys.add(key);
        }
      });
    });
    return Array.from(keys);
  };

  // Пагинация: расчет индексов для текущей страницы
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = userData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(userData.length / itemsPerPage);

  // Функции для навигации по страницам
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const goToPrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <motion.div
      className="admin-panel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="admin-content">
        {/* Левая панель фильтров */}
        <motion.aside
          className="filters-panel"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Фильтры</h2>
          <form onSubmit={handleSubmit} className="filters-form">
            {["account", "passport", "location", "bank", "study"].map((category) => (
              <div key={category} className="settings-category">
                <h3>
                  {(() => {
                    switch (category) {
                      case "account":
                        return "Контактные Данные";
                      case "passport":
                        return "Паспортные данные";
                      case "location":
                        return "Геоданные";
                      case "bank":
                        return "Банковские данные";
                      case "study":
                        return "Информация об учебе";
                      default:
                        return category;
                    }
                  })()}
                </h3>
                {Object.keys(settings[category]).map((field) => (
                  <div key={field} className="radio-group">
                    <span className="field-label">{field}</span>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name={`${category}-${field}`}
                        value="mask"
                        checked={settings[category][field] === "mask"}
                        onChange={() => handleRadioChange(category, field, "mask")}
                      />
                      <FaMask className="icon" title="Mask" aria-label="Mask" />
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name={`${category}-${field}`}
                        value="delete"
                        checked={settings[category][field] === "delete"}
                        onChange={() => handleRadioChange(category, field, "delete")}
                      />
                      <FaTrash className="icon" title="Delete" aria-label="Delete" />
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name={`${category}-${field}`}
                        value="filter"
                        checked={settings[category][field] === "filter"}
                        onChange={() => handleRadioChange(category, field, "filter")}
                      />
                      <FaFilter className="icon" title="Filter" aria-label="Filter" />
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name={`${category}-${field}`}
                        value="none"
                        checked={settings[category][field] === "none"}
                        onChange={() => handleRadioChange(category, field, "none")}
                      />
                      <FaTimes className="icon" title="None" aria-label="None" />
                    </label>
                  </div>
                ))}
              </div>
            ))}

            <button type="submit" className="save-button">
              Сохранить настройки
            </button>
          </form>
        </motion.aside>

        {/* Центральная область данных */}
        <motion.main
          className="data-section"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>Полученные данные</h2>

          {/* Кнопки управления WebSocket */}
          <div className="websocket-controls">
            <button
              onClick={initializeWebSocket}
              className="websocket-button"
              disabled={isConnected} // Используем состояние подключения
            >
              Загрузить данные
            </button>
            <button
              onClick={closeWebSocket}
              className="websocket-button"
              disabled={!isConnected} // Используем состояние подключения
            >
              Отключиться
            </button>
          </div>

          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <p className="error">{error}</p>
          ) : userData.length === 0 ? (
            <p>Нет данных для отображения.</p>
          ) : (
            <>
              <div className="table-container">
                <motion.table
                  className="user-data-table"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  <thead>
                    <tr>
                      {getDisplayedKeys().map((key) => (
                        <th key={key}>{key.replace(/_/g, " ")}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((user, index) => (
                      <motion.tr
                        key={user.UserID || index} // Предпочтительно использовать уникальный идентификатор
                        whileHover={{ scale: 1.02, backgroundColor: "#2a2a2a" }}
                        transition={{ duration: 0.3 }}
                      >
                        {getDisplayedKeys().map((key) => (
                          <td key={key}>{displayData(user[key])}</td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </motion.table>
              </div>

              {/* Пагинация */}
              <div className="pagination">
                <button onClick={goToPrevPage} className="pagination-button" disabled={currentPage === 1}>
                  Назад
                </button>
                {/* Отображаем номера страниц */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => goToPage(number)}
                    className={`pagination-button ${currentPage === number ? "active" : ""}`}
                  >
                    {number}
                  </button>
                ))}
                <button onClick={goToNextPage} className="pagination-button" disabled={currentPage === totalPages}>
                  Вперед
                </button>
              </div>
            </>
          )}
        </motion.main>
      </div>
    </motion.div>
  );
}

export default AdminPanel;
