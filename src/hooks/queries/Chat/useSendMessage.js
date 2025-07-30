// hooks/chat/useSendMessage.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/config";

const sendMessage = async ({ token, receiver_id, message }) => {
  const payload = {
    receiver_id,
    message: message.trim(),
    message_type: "text",
  };

  const { data } = await axiosInstance.post("chat", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
console.log(data);

  return {
    sentMessage: {
      id: data.message.id,
      is_mine: true,
      message: message.trim(),
      sender: data.message.sender,
      created_at: new Date().toISOString(),
      is_read: false,
    },
    receiver_id,
  };
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ["conversation", variables.receiver_id] });

      const previous = queryClient.getQueryData(["conversation", variables.receiver_id]);

      queryClient.setQueryData(["conversation", variables.receiver_id], (old) => ({
        ...old,
        messages: [...(old?.messages || []), variables.sentMessage],
      }));

      return { previous };
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["conversation", data.receiver_id] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.invalidateQueries({ queryKey: ["unreadCount"] });
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["conversation", variables.receiver_id], context.previous);
      alert("فشل إرسال الرسالة. تحقق من الاتصال أو الصلاحيات.");
    },
    retry: 2,
  });
};