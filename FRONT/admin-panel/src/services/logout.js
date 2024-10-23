export const logoutUser = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/users/logout/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при выходе");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Ошибка:", error);
      throw error;
    }
  };