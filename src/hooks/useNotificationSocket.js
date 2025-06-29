



// useNotificationSocket
import { useEffect } from "react";
import Pusher from "pusher-js";
import { useQueryClient } from "@tanstack/react-query";

const useNotificationSocket = (employeeId, token) => {
  const queryClient = useQueryClient();
  console.log(token);

  useEffect(() => {
    if (!employeeId) return;

    Pusher.logToConsole = true;

    const pusher = new Pusher("4552575846fabb786946", {
      cluster: "eu",
      encrypted: true,
      forceTLS: true,
      authEndpoint: "/broadcasting/auth",
      auth: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    // ✅ Laravel default private channel format
    const channel = pusher.subscribe(`private-App.Models.User.${employeeId}`);
    console.log(channel);

    // ✅ Listen to notification broadcast event
    channel.bind("Illuminate\\Notifications\\Events\\BroadcastNotificationCreated", (data) => {
      console.log("📨 Real-time notification received:", data);
  if (data.type === 'new_listing') {
        queryClient.invalidateQueries(["notifications"]);
    }
      // 🔁 Re-fetch notifications list
      queryClient.invalidateQueries(["notifications"]);
    });

    pusher.connection.bind("error", (err) => {
      console.error("🚨 Pusher connection error", err);
    });

    return () => {
      // pusher.leave();

      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [employeeId, queryClient]);
};

export default useNotificationSocket;
