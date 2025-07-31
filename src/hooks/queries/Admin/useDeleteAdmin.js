// hooks/queries/useDeleteAdmin.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/config";
// import axiosInstance from "../../api/config";

export const useDeleteAdmin = (token) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(`/admin/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] }); // تحديث القائمة
    },
    enabled: !!token,
  });
};

