// hooks/chat/useChatUsers.js
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/authContext";
import axiosInstance from "../../../api/config";
 

const fetchChatUsers = async ({ token }) => {
  const { data } = await axiosInstance.get("chat/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log("Fetched chat users:", data);
  
  return data.data.users.map((user) => ({
    id: user.id,
    name: user.name,
  }));
};
;

export const useChatUsers = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["chatUsers", user?.token],
    queryFn: () => fetchChatUsers({ token: user?.token }),
    // staleTime: 1000 * 60 * 5,
    // cacheTime: 1000 * 60 * 10,
    enabled: !!user?.token,
    keepPreviousData: true,
    refetchOnWindowFocus: true,
    retry: 2,
  });
};