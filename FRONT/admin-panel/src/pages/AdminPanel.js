// src/pages/AdminPanel.js

import React, { useState, useRef, useEffect } from "react";
import { updateSettings } from "../services/admin";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "../styles/adminPanel.css";

function AdminPanel() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false); // Изначально не загружаем
  const [error, setError] = useState("");

  const [settings, setSettings] = useState({
    account: {
      Email: false,
      Endpoint: false,
      "Номер телефона": false,
      Логин: false,
      Пароль: false,
      Timestamp: false,
      Message: false,
      SupportLevel: false,
      UserID: false,
    },
    passport: {
      Фамилия: false,
      Имя: false,
      Отчество: false,
      "Дата рождения": false,
      Пол: false,
      Возраст: false,
      "Адрес прописки": false,
      "Серия и номер паспорта": false,
      "Код подразделения": false,
      "Кем выдан": false,
    },
    location: {
      Страна: false,
      Регион: false,
      Город: false,
      Улица: false,
      "Номер дома": false,
    },
    bank: {
      "номер счета": false,
      "Имя владельца карты": false,
      "Номер кредитной карты": false,
      "Срок действия карты": false,
    },
    study: {
      Специальность: false,
      Направление: false,
      "Учебное заведение": false,
      "Серия/Номер диплома": false,
      "Регистрационный номер": false,
    },
  });

  const [way, setWay] = useState({
    Mask: false,
    Delete: false,
    Filter: false,
  });

  // useRef для хранения экземпляра WebSocket
  const socketRef = useRef(null);

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
      } else {
        toast.info("WebSocket соединение закрыто");
      }

      // Очистка ref при закрытии соединения
      socketRef.current = null;
    };
  };

  // Функция для отключения WebSocket-соединения
  const closeWebSocket = () => {
    if (socketRef.current) {
      socketRef.current.close(1000, "User disconnected");
      socketRef.current = null;
      toast.info("WebSocket соединение закрыто");
    } else {
      toast.info("WebSocket не подключен");
    }
  };

  // Автоматическое подключение WebSocket через 1 секунду после загрузки компонента
  useEffect(() => {
    const timer = setTimeout(() => {
      initializeWebSocket();
    }, 1000); // 1000 миллисекунд = 1 секунда

    return () => {
      clearTimeout(timer);
      // Очистка соединения при размонтировании компонента
      if (socketRef.current) {
        socketRef.current.close(1000, "Component unmounted");
      }
    };
  }, []);

  const handleCheckboxChange = (category, field) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [category]: {
        ...prevSettings[category],
        [field]: !prevSettings[category][field],
      },
    }));
  };

  const handleWayChange = (field) => {
    setWay((prevWay) => ({
      ...prevWay,
      [field]: !prevWay[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Собираем активные поля в один массив
    const selectedFields = [];

    const categories = ["account", "passport", "location", "bank", "study"];

    categories.forEach((category) => {
      Object.keys(settings[category]).forEach((field) => {
        if (settings[category][field]) {
          selectedFields.push(field);
        }
      });
    });

    const payload = {
      Mask: way.Mask,
      Delete: way.Delete,
      Filter: way.Filter,
      Fields_to_hide: selectedFields,
    };

    // Логируем отправляемые настройки для проверки
    console.log("Отправляемые поля:", payload);

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
        if (settings[category][field]) {
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
            <div className="settings-category">
              <h3>Настройки</h3>
              {Object.keys(way).map((field) => (
                <label key={field} className="checkbox-label">
                  <input type="checkbox" checked={way[field]} onChange={() => handleWayChange(field)} />
                  {field}
                </label>
              ))}
            </div>
            <div className="settings-category">
              <h3>Контактные Данные</h3>
              {Object.keys(settings.account).map((field) => (
                <label key={field} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.account[field]}
                    onChange={() => handleCheckboxChange("account", field)}
                  />
                  {field}
                </label>
              ))}
            </div>

            <div className="settings-category">
              <h3>Паспортные данные</h3>
              {Object.keys(settings.passport).map((field) => (
                <label key={field} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.passport[field]}
                    onChange={() => handleCheckboxChange("passport", field)}
                  />
                  {field}
                </label>
              ))}
            </div>

            <div className="settings-category">
              <h3>Геоданные</h3>
              {Object.keys(settings.location).map((field) => (
                <label key={field} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.location[field]}
                    onChange={() => handleCheckboxChange("location", field)}
                  />
                  {field}
                </label>
              ))}
            </div>

            <div className="settings-category">
              <h3>Банковские данные</h3>
              {Object.keys(settings.bank).map((field) => (
                <label key={field} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.bank[field]}
                    onChange={() => handleCheckboxChange("bank", field)}
                  />
                  {field}
                </label>
              ))}
            </div>

            <div className="settings-category">
              <h3>Информация об учебе</h3>
              {Object.keys(settings.study).map((field) => (
                <label key={field} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.study[field]}
                    onChange={() => handleCheckboxChange("study", field)}
                  />
                  {field}
                </label>
              ))}
            </div>

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
            <button onClick={initializeWebSocket} className="websocket-button" disabled={socketRef.current !== null}>
              Загрузить данные
            </button>
            <button onClick={closeWebSocket} className="websocket-button" disabled={socketRef.current === null}>
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