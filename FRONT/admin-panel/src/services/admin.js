import Cookies from "js-cookie"

export const fetchUserData = async () => {
  const token = Cookies.get("access_token")
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
};

export const updateSettings = async (selectedFields, email) => {
  const response = await fetch("http://127.0.0.1:8080/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-UserEmail": {email}
    },
    body: JSON.stringify(selectedFields),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Ошибка при сохранении настроек");
  }

  const data = await response.json();
  return data;
};
