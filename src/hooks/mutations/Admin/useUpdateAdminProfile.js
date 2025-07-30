// hooks/mutations/useUpdateAdminProfile.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/config";

export const useUpdateAdminProfile = (token) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedData) => {
      const { data } = await axiosInstance.put("/admin/profile", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["adminProfile"]);
    },
  });
};
