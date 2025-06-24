

  // useNotifications.js
  import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
  import axiosInstance from "../../../api/config"; 
  import { useAuth } from "../../../context/authContext";

  const fetchNotifications = async ({
      token,
  }) => {

      const { data } = await axiosInstance.get("notifications", {
          headers: { Authorization: `Bearer ${token}` },
      });

      return data;
  };



  export const useNotifications = (
  ) => {
      const { user } = useAuth();


    return useQuery({
      queryKey: ["notifications"],
      queryFn: () => fetchNotifications({ token: user?.token }),
      staleTime: 0,
      cacheTime: 1000 * 60 * 5,
      enabled: !!user?.token, // ما يشتغلش قبل وجود التوكن
      refetchOnWindowFocus: false,
    });
  };








// // useNotifications.js
// import { useQueryClient, useQuery } from "@tanstack/react-query";
// import axiosInstance from "../../../api/config";
// import { useAuth } from "../../../context/authContext";
// import { useEffect } from "react";
// import { useSocket } from "../useSocket";
// // import { useSocket } from "../../useSocket";

// const fetchNotifications = async ({ token }) => {
//   const { data } = await axiosInstance.get("notifications", {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return data;
// };

// export const useNotifications = () => {
//   const { user } = useAuth();
//   const socket = useSocket();
//   const queryClient = useQueryClient();

//   const query = useQuery({
//     queryKey: ["notifications"],
//     queryFn: () => fetchNotifications({ token: user?.token }),
//     enabled: !!user?.token,
//     refetchOnWindowFocus: false,
//   });

//   useEffect(() => {
//     if (!socket || !user?.token) return;

//     socket.on("notification", (newNotif) => {
//       // بدل ما تعمل refetch تقدر تعمل update مباشرة أو تستخدم:
//       queryClient.invalidateQueries(["notifications"]);
//     });

//     return () => {
//       socket.off("notification");
//     };
//   }, [socket, user?.token]);

//   return query;
// };
