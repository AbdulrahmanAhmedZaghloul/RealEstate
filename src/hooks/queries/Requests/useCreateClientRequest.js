import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/config";
import { useAuth } from "../../../context/authContext";

const postClientRequest = async ({ token, payload }) => {
      const { data } = await axiosInstance.post("crm", payload, {
            headers: { Authorization: `Bearer ${token}` },
      });
      return data; // {status, message, data: {...new request...}}
};

export const useCreateClientRequest = () => {
      const { user } = useAuth();
      const queryClient = useQueryClient();

      return useMutation({
            mutationFn: (payload) => postClientRequest({ token: user.token, payload }),
            // Optimistic update (اختياري بسيط)
            // سنكتفي الآن بـ invalidate بعد النجاح لسهولة التزامن مع السيرفر.
            onSuccess: (_resp) => {
                  // أعد جلب جدول الطلبات + KPIs
                  queryClient.invalidateQueries({ queryKey: ["client-requests"] });
            },
      });
};
