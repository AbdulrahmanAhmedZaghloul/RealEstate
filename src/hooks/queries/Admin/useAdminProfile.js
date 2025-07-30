// hooks/queries/useAdminProfile.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/config";

export const useAdminProfile = (token) =>
  useQuery({
    queryKey: ["adminProfile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.admin;
    },
    enabled: !!token,
  });
