
// src/services/admin.js

export const fetchUserData = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8000/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка при получении данных");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка:", error);
    throw error;
  }
};

export const updateSettings = async (selectedFields) => {
  try {
    // Временно убираем токен, так как прокси не требует аутентификации
    // const token = localStorage.getItem("token");
    const response = await fetch("http://127.0.0.1:8080/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`, // Удаляем или комментируем заголовок авторизации
      },
      body: JSON.stringify(selectedFields),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка при сохранении настроек");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка:", error);
    throw error;
  }
};
