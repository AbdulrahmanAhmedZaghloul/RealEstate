// hooks/chat/useUnreadCount.js
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/authContext";
import axiosInstance from "../../../api/config";

const fetchUnreadCount = async ({ token }) => {
  const { data } = await axiosInstance.get("chat/unread-count", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data.data.count;
};

export const useUnreadCount = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["unreadCount", user?.token],
    queryFn: () => fetchUnreadCount({ token: user?.token }),
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    enabled: !!user?.token,
    refetchInterval: 1000 * 10,  
  });
};