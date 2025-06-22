import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchCategoryPerformance = async (token, timeFrame, month, year) => {
       const params = new URLSearchParams({ time_frame: timeFrame });

    if (timeFrame === 'year' && year) {
        params.append('year', year);
    } else if (timeFrame === 'month' && month && year) {
        params.append('month', month);
        params.append('year', year);
    }

    const { data } = await axiosInstance.get(`kpi/category-performance?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

export const useCategoryPerformance = (timeFrame = "yearly", month = "", year = "") => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['categoryPerformance', timeFrame, month, year],
        queryFn: () => fetchCategoryPerformance(user.token, timeFrame, month, year),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
