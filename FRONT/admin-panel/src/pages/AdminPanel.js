// src/pages/AdminPanel.js

import React, { useState, useEffect } from "react";
import { fetchUserData, updateSettings } from "../services/admin";
import { motion } from "framer-motion";
import { toast } from "react-toastify"; // Добавляем импорт react-toastify для уведомлений
import "../styles/adminPanel.css";

function AdminPanel() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [settings, setSettings] = useState({
    account: {
      Email: false,
      Endpoint: false,
      "Номер телефона": false,
      //Login: false,
      "Логин": false,
      "Пароль": false,
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
      "Специальность": false,
      "Направление": false,
      "Учебное заведение": false,
      "Серия/Номер диплома": false,
      "Регистрационный номер": false,
    },
  });

  const [way, setWay] = useState({
    Mask: false,
    Delete: false,
    Filter: false
  })

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getUserData();
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

    const categories = ['account', 'passport', 'location', 'bank', 'study'];

    categories.forEach(category => {
      Object.keys(settings[category]).forEach(field => {
        if (settings[category][field]) {
          selectedFields.push(field);
        }
      });
    });

    const payload = {
      Mask: way.Mask,
      Delete: way.Delete,
      Filter: way.Filter,
      Fields_to_hide: selectedFields
    };

    // Логируем отправляемые настройки для проверки
    console.log("Отправляемые поля:", payload);

    try {
      await updateSettings(payload);
      toast.success("Настройки успешно сохранены!");
    } catch (err) {
      toast.error(`Ошибка: ${err.message}`);
    }
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
                  <input
                    type="checkbox"
                    checked={way[field]}
                    onChange={() => handleWayChange(field)}
                  />
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
          {loading ? (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <motion.table
              className="user-data-table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Имя</th>
                  <th>Фамилия</th>
                  <th>Номер телефона</th>
                  <th>Пол</th>
                  <th>Возраст</th>
                  <th>Дата рождения</th>
                  {/* Добавьте другие столбцы по необходимости */}
                </tr>
              </thead>
              <tbody>
                {userData.map((user) => (
                  <motion.tr
                    key={user.UserID}
                    whileHover={{ scale: 1.02, backgroundColor: "#2a2a2a" }}
                    transition={{ duration: 0.3 }}
                  >
                    <td>{user.Email}</td>
                    <td>{user.Имя}</td>
                    <td>{user.Фамилия}</td>
                    <td>{user["Номер телефона"]}</td>
                    <td>{user.Пол}</td>
                    <td>{user.Возраст}</td>
                    <td>{user["Дата рождения"]}</td>
                    {/* Добавьте другие поля по необходимости */}
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          )}
        </motion.main>
      </div>
    </motion.div>
  );
}

export default AdminPanel;
