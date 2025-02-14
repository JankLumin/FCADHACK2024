// src/services/register.js

export const registerUser = async (userData) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Ошибка при регистрации");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
  } catch (error) {
    console.error("Ошибка:", error);
    throw error;
  }
};
