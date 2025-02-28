import Pusher from "pusher-js";
import { useState } from "react";

type Props = {
  token: string | null;
};

export const useEcho = ({ token }: Props) => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribe = () => {
    if (!token) {
      console.error("Токен отсутствует");
      return;
    }

    Pusher.logToConsole = true;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_REVERB_APP_KEY as string, {
      cluster: "mt1",
      wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
      wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT),
      forceTLS: false,
      enabledTransports: ["ws"],
      channelAuthorization: {
        transport: "ajax",
        endpoint: "http://localhost:8084/broadcasting/auth",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const channel = pusher.subscribe("private-chat.1");

    channel.bind("ChatMessageReceived", function (data) {
      alert(JSON.stringify(data));
    });

    setIsSubscribed(true);

    // Очистка при размонтировании
    return () => {
      pusher.unsubscribe("private-chat.1");
      pusher.disconnect();
    };
  };

  return { subscribe, isSubscribed };
};