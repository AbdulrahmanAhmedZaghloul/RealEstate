// hooks/queries/useMyCurrentSubscription.js

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/config";
import { useAuth } from "../../context/authContext";

const fetchCurrentSubscription = async (token) => {
  const { data } = await axiosInstance.get("stripe/subscriptions/current", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!data.success || !data.data) {
    throw new Error("No subscription found");
  }

  const subscription = data.data.subscription;
  const stripeSub = data.data.stripe_subscription;

  if (!stripeSub || !stripeSub.items?.data?.length) {
    return {
      plan_id: subscription?.id || null,
      plan_name: subscription?.name || "No Plan",
      price: 0,
      currency: "usd",
      duration_days: 30,
      start_date: null,
      end_date: null,
      status: "inactive",
      raw: data.data,
    };
  }

  const planItem = stripeSub.items.data[0];
  const price = planItem.price;
    // localStorage.setItem("currentPlanId", subscription.id);

  return {
    plan_id: subscription.id,
    plan_name: subscription.name || "Custom Plan",
    price: (price.unit_amount || 0) / 100, // تحويل من سنتات
    currency: price.currency || "usd",
    duration_days: price.recurring?.interval === "year" ? 365 : 30,
    start_date: new Date(planItem.current_period_start * 1000).toISOString(),
    end_date: new Date(planItem.current_period_end * 1000).toISOString(),
    status: stripeSub.status,
    raw: data.data,
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
