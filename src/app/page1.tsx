"use client";

import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

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
  
      // Логирование заголовков ответа
      console.log('Заголовки ответа:', Object.fromEntries(response.headers.entries()));
  
      if (!response.ok) {
        throw new Error('Ошибка при входе');
      }
  
      const data = await response.json();
      console.log('Ответ сервера:', data);
  
      // Сохранение токена в localStorage
      localStorage.setItem('token', data.data.access_token);
      setIsLoggedIn(true);
  
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  const subscribeToChannel = () => {
    if (!isLoggedIn) {
      console.warn('Пользователь не авторизован. Сначала выполните вход.');
      return;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_REVERB_APP_KEY as string, {
      cluster: 'mt1',
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),
      forceTLS: false,
      enabledTransports: ['ws'],
      channelAuthorization: {
        transport: 'jsonp',
        endpoint: 'http://localhost:8084/broadcasting/auth',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
      authEndpoint: "http://localhost:8084/broadcasting/auth",
    });

    const echo = new Echo({
      broadcaster: "pusher",
      client: pusher,
    })

    echo.private('chat.1')
      .listen('ChatMessageReceived', (e: any) => {
        console.log('Событие ChatMessageReceived получено:', e);
      })
      .error((error: any) => {
        console.error('Ошибка при прослушивании канала:', error);
      });

    pusher.connection.bind('error', (error: any) => {
      console.error('Ошибка подключения к Pusher:', error);
    });

    pusher.connection.bind('connected', () => {
      console.log('Успешное подключение к Pusher');
      setIsSubscribed(true);
    });

    pusher.connection.bind('disconnected', () => {
      console.log('Отключено от Pusher');
      setIsSubscribed(false);
    });
  };

  return (
    <div style={{display: 'flex', gap: '50px', margin: '50px'}}>
      <button style={{padding: '5px'}} onClick={login} disabled={isLoggedIn}>
        {isLoggedIn ? 'Вы авторизованы' : 'Войти'}
      </button>
      <button style={{padding: '5px'}} onClick={subscribeToChannel} disabled={!isLoggedIn}>
        {isSubscribed ? 'Подписка активна' : 'Подписаться на канал'}
      </button>
    </div>
  );
}