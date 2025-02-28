import { useState } from "react";

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const login = async () => {
    try {
      const response = await fetch('http://localhost:8084/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'some@email.com',
          password: 'some@password!1Q',
        }),
      });
  
      if (!response.ok) {
        throw new Error('Ошибка при входе');
      }
  
      const data = await response.json();
      setIsLoggedIn(true);
      setToken(data.data.access_token);

    } catch (error) {
      console.error('Ошибка:', error);
    }
  }

  return {
    login,
    isLoggedIn,
    token,
  }
}