



// useNotificationSocket
import { useEffect } from "react";
import Pusher from "pusher-js";
import { useQueryClient } from "@tanstack/react-query";

const useNotificationSocket = (employeeId,token) => {
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
    const channel = pusher.subscribe(`chummy-flower-127.${employeeId}`);

    // ✅ Listen to notification broadcast event
    channel.bind("new_listing", (data) => {
      console.log("📨 Real-time notification received:", data);

      // 🔁 Re-fetch notifications list
      queryClient.invalidateQueries(["notifications"]);
    });

    pusher.connection.bind("error", (err) => {
      console.error("🚨 Pusher connection error", err);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [employeeId, queryClient]);
};

export default useNotificationSocket;


// // useNotificationSocket.js

// import { useEffect } from "react";
// import Pusher from "pusher-js";
// import { useQueryClient } from "@tanstack/react-query";

// const useNotificationSocket = (employeeId, newListingNotifications) => {
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     if (!employeeId) return;

//     Pusher.logToConsole = true;
//     const pusher = new Pusher("4552575846fabb786946", {
//       cluster: "eu",
//       encrypted: true,
//     });
//     const channel = pusher.subscribe(`chummy-flower-127.${employeeId}`);
//     // console.log(notifications.data);

//     channel.bind(`${newListingNotifications}`, (data) => {
//       console.log("📨 New notification received!", data);
//     });

//     pusher.connection.bind("error", (err) => {
//       console.error("🚨 Pusher connection error", err);
//     });
//     //  channel.bind_global((eventName, data) => {
//     //   console.group("📬 New Event Received");
//     //   console.log("Event Name:", eventName);
//     //   console.log("Data:", data);
//     //   console.groupEnd();

//     //   // 🔁 تحديث قائمة الإشعارات إذا كان هذا حدث إشعار حقيقي
//     //   if (data && data.notification) {
//     //     queryClient.invalidateQueries(["notifications"]);
//     //   }
//     // });

//     return () => {
//       channel.unbind_all();
//       channel.unsubscribe();
//       pusher.disconnect();
//     };
//   }, [employeeId, queryClient]);
// };

// export default useNotificationSocket;

