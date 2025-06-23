// hooks/queries/QueriesAnalytics/CompanyKpi/useSellingKpi.js
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../../context/authContext';
import axiosInstance from '../../../../api/config';

const fetchCompanyKPIs = async (token, timeFrame, month, year) => {
    const params = new URLSearchParams({ time_frame: timeFrame });

    if (timeFrame === 'year' && year) {
        params.append('year', year);
    } else if (timeFrame === 'month' && month && year) {
        params.append('month', month);
        params.append('year', year);
    }

    const { data } = await axiosInstance.get(`marketer/kpi/combined/profitability-analysis?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return data;
};

export const useSellingMarketerKpi = (timeFrame = "yearly", month = "", year = "") => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['SellingMarketerKpi', timeFrame, month, year],
        queryFn: () => fetchCompanyKPIs(user.token, timeFrame, month, year),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        enabled: !!user?.token,
    });
};
 