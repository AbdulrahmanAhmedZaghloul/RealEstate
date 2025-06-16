import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/authContext";
import axiosInstance from "../../api/config";

// Fetch contracts with cursor-based pagination
const fetchContracts = async ({ pageParam = 0, token, filters = {} }) => {
  const params = new URLSearchParams();

  // الفلاتر
  if (filters.search) params.append("search", filters.search);
  if (filters.title) params.append("title", filters.title);
  if (filters.customer_name) params.append("customer_name", filters.customer_name);
  if (filters.employee_name) params.append("employee_name", filters.employee_name);
  if (filters.location) params.append("location", filters.location);
  if (filters.status) params.append("status", filters.status);
  if (filters.contract_type) params.append("contract_type", filters.contract_type);
  if (filters.creation_date) params.append("creation_date", filters.creation_date);
  if (filters.effective_date) params.append("effective_date", filters.effective_date);
  if (filters.expiration_date) params.append("expiration_date", filters.expiration_date);

  // الكيرسر والليمت
  params.append("cursor", pageParam);
  params.append("limit", "1");

  const { data } = await axiosInstance.get(`contracts?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return {
    contracts: data.data.data.data,
    pagination: data.data.pagination,
  };
};

// Hook
export const useContractsInfinite = (filters = {}) => {
  const { user } = useAuth();

  return useInfiniteQuery({
    queryKey: ["contracts-infinite", filters],
    queryFn: ({ pageParam = 0 }) =>
      fetchContracts({ pageParam, token: user.token, filters }),
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.has_more ? lastPage.pagination.next_cursor : undefined,
    enabled: !!user?.token,
    staleTime: 0,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
