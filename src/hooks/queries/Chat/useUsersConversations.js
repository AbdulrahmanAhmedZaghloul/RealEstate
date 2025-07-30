// hooks/queries/Chat/useConversations.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/config";
import { useAuth } from "../../../context/authContext";
// import { useAuth } from "../../../context/authContext";
// import axiosInstance from "../../../api/config";

const fetchConversations = async ({ token }) => {
  const { data } = await axiosInstance.get("chat", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data.data.conversations;
};

export const useUserConversations = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["conversations", user?.token],
    queryFn: () => fetchConversations({ token: user?.token }),
    enabled: !!user?.token,
    refetchOnWindowFocus: true,
    retry: 2,
  });
};
