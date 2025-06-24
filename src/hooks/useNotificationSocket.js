import { useEffect } from "react";
import Pusher from "pusher-js";
import { useQueryClient } from "@tanstack/react-query";

const useNotificationSocket = (employeeId) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!employeeId) return;

    Pusher.logToConsole = true;
    const pusher = new Pusher("4552575846fabb786946", {
      cluster: "eu",
      encrypted: true,
    }); 
    const channel = pusher.subscribe(`chummy-flower-127.${employeeId}`);

     channel.bind_global((eventName, data) => {
      console.group("📬 New Event Received");
      console.log("Event Name:", eventName);
      console.log("Data:", data);
      console.groupEnd();

      // 🔁 تحديث قائمة الإشعارات إذا كان هذا حدث إشعار حقيقي
      if (data && data.notification) {
        queryClient.invalidateQueries(["notifications"]);
      }
    });
 
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [employeeId, queryClient]);
};

export default useNotificationSocket;

