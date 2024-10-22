// src/services/login.js
import Cookies from "js-cookie"

export const loginUser = async (userData) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/users/login/", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка при авторизации");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка:", error);
    throw error;
  }
};
