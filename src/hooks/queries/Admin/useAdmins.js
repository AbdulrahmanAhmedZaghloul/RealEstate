// hooks/queries/useAdmins.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/config";

export const useAdmins = (token) =>
  useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/admin/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data.data; // لأن API يُرجع data: [ ... ]
    },
    enabled: !!token,
  });
