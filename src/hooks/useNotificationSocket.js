import { useEffect } from "react";
import Pusher from "pusher-js";
import { useQueryClient } from "@tanstack/react-query";

const useNotificationSocket = (userId) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    Pusher.logToConsole = true;
    const pusher = new Pusher("4552575846fabb786946", {
      cluster: "eu",
      encrypted: true,
    });

    const channel = pusher.subscribe(`private-user.${userId}`);

    channel.bind("chummy-flower-127", (data) => {
      console.log("📨 إشعار جديد وصل!", data);
      queryClient.invalidateQueries(["notifications"]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [userId, queryClient]);
};

export default useNotificationSocket;

