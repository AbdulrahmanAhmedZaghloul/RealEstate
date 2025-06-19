// hooks/queries/QueriesAnalytics/CompanyKpi/useSellingKpi.js
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../context/authContext';
import axiosInstance from '../../../../api/config';

const fetchCompanyKPIs = async (token, timeFrame, selectedValue) => {
  const params = new URLSearchParams({ time_frame: timeFrame });

  if (timeFrame === 'year') {
    params.append('year', selectedValue);
  } else if (timeFrame === 'month') {
    params.append('month', selectedValue);
  }

  const { data } = await axiosInstance.get(`kpi/company?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data;
};

export const useSellingKpi = (timeFrame = "yearly", selectedValue = "") => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['SellingKpi', timeFrame, selectedValue],
    queryFn: () => fetchCompanyKPIs(user.token, timeFrame, selectedValue),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!user?.token,
  });
};
