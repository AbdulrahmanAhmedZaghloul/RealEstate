// hooks/queries/useUpdateAdmin.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/config";

export const useUpdateAdmin = (token) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updatedData }) => {
      const { data } = await axiosInstance.put(
        `/admin/admins/${id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] }); // تحديث القائمة
    },
  });
};
 