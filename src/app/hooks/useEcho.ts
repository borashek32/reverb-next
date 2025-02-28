import Pusher from "pusher-js";
import { useState } from "react";

type Props = {
  token: string | null
}

export const useEcho = ({ token }: Props) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  Pusher.logToConsole = true;

  const pusher = new Pusher(process.env.NEXT_PUBLIC_REVERB_APP_KEY as string, {
    cluster: 'mt1',
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),
    forceTLS: false,
    enabledTransports: ['ws'],
    channelAuthorization: {
      transport: 'ajax',
      endpoint: 'http://localhost:8084/broadcasting/auth',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    authEndpoint: "http://localhost:8084/broadcasting/auth",
  });

  const channel = pusher.subscribe('private-chat.1');
  
  const subscribe = () => {
    channel.bind('ChatMessageReceived', function(data) {
      alert(JSON.stringify(data));
      setIsSubscribed(true);
    });
  }

  return { subscribe, isSubscribed }
}