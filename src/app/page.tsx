"use client";

import { useAuth } from './hooks/useAuth';
import { useEcho } from './hooks/useEcho';

export default function Home() {
  const { login, isLoggedIn, token } = useAuth();
  const { subscribe, isSubscribed } = useEcho({ token });

  return (
    <div style={{display: 'flex', gap: '50px', margin: '50px'}}>
      <button style={{padding: '5px'}} onClick={login} disabled={isLoggedIn}>
        {isLoggedIn ? 'Вы авторизованы' : 'Войти'}
      </button>
      <button style={{padding: '5px'}} onClick={subscribe} disabled={!isLoggedIn}>
        {isSubscribed ? 'Подписка активна' : 'Подписаться на канал'}
      </button>
    </div>
  );
}