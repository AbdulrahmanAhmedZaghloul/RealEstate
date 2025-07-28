// hooks/chat/useConversation.js
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/authContext";
import axiosInstance from "../../../api/config";

const fetchConversation = async ({ token, userId }) => {
  const { data } = await axiosInstance.get(`chat/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    conversation_with: data.data.conversation_with,
    messages: data.data.messages.map((msg) => ({
      id: msg.id,
      is_mine: msg.is_mine,
      message: msg.message,
      sender: msg.sender,
      created_at: msg.created_at,
      is_read: msg.is_read,
    })),
    unread_messages: data.data.unread_messages || [],
  };
};

export const useConversation = (userid) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["conversation", userid?.id, user?.token],
    queryFn: () => fetchConversation({ token: user?.token, userId: userid?.id }),
    // staleTime: 1000 * 60 * 5,
    // cacheTime: 1000 * 60 * 10,
    enabled: !!user?.token && !!userid?.id,
    keepPreviousData: true,
    refetchOnWindowFocus: true,
    retry: 2,
  });
};