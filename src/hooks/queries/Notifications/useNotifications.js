

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

