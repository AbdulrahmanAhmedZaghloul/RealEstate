// hooks/queries/useMyCurrentSubscription.js

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";

const fetchCurrentSubscription = async (token) => {
  const { data } = await axiosInstance.get("stripe/subscriptions/current", {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(data);

  const stripe = data.data?.stripe_subscription;
  const planItem = stripe?.items?.data?.[0];
  const planId = data?.data?.subscription?.id;

  return {
    plan_id: planId,
    plan_name: data.data?.subscription?.name || "Default",
    price: (planItem?.price?.unit_amount || 0) / 100,
    currency: planItem?.price?.currency || "usd",
    duration_days: planItem?.price?.recurring?.interval === "year" ? 365 : 30,
    start_date: new Date(planItem?.current_period_start * 1000).toISOString(),
    end_date: new Date(planItem?.current_period_end * 1000).toISOString(),
    raw: data.data, // (اختياري) لو حبيت ترجع الـ raw data كمان
  };
};

export const useMyCurrentSubscription = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["currentSubscription"],
    queryFn: () => fetchCurrentSubscription(user.token),
    staleTime: 1000 * 60 * 5, // 5 دقائق
    cacheTime: 1000 * 60 * 10, // 10 دقائق
    enabled: !!user?.token,
  });
};
