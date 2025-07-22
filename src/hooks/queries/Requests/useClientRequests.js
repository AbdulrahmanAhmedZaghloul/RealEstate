// src/hooks/queries/Requests/useClientRequests.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/config";
import { useAuth } from "../../../context/authContext";

/**
 * Fetch paginated client requests + KPIs
 */
const fetchClientRequests = async ({ token, page }) => {
      const { data } = await axiosInstance.get("crm", {
            headers: { Authorization: `Bearer ${token}` },
            params: { page }, // يعتمد على دعم الباك إند لـ ?page=
      });
      return data; // الاستجابة الكاملة (status + data)
};

export const useClientRequests = (page = 1) => {
      const { user } = useAuth();

      return useQuery({
            queryKey: ["client-requests", page, user?.token],
            queryFn: () => fetchClientRequests({ token: user.token, page }),
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 10,
            enabled: !!user?.token,
            keepPreviousData: true, // مهم للـ pagination عشان ما يفلاشش الجدول
      });
};
