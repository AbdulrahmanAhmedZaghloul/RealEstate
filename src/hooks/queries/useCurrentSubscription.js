// hooks/queries/useCurrentSubscription.js
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";

const fetchCurrentSubscription = async (token) => {
  const { data } = await axiosInstance.get("stripe/products", {
    headers: { Authorization: `Bearer ${token}` },
  });

  console.log("Fetched subscription data:", data);

  // نفترض أن `data.data` هو المصفوفة التي تحتوي على الخطط
  return data; // يُفترض أن تكون { success: true, data: [...] }
};

export const useCurrentSubscription = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["currentSubscription"],
    queryFn: () => fetchCurrentSubscription(user.token),
    staleTime: 1000 * 60 * 5, // 5 دقائق
    cacheTime: 1000 * 60 * 10, // 10 دقائق
    enabled: !!user?.token,
    retry: 2, // حاول مرتين قبل إظهار الخطأ
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.error("Error fetching subscription plans:", error);
    },
  });
};



