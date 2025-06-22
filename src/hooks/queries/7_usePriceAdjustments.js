import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchPriceAdjustments = async (token, timeFrame, month, year) => {
        const params = new URLSearchParams({ time_frame: timeFrame });

    if (timeFrame === 'year' && year) {
        params.append('year', year);
    } else if (timeFrame === 'month' && month && year) {
        params.append('month', month);
        params.append('year', year);
    }

    const { data } = await axiosInstance.get(`kpi/price-adjustments?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

export const usePriceAdjustments = (timeFrame = "yearly", month = "", year = "") => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['priceAdjustments', timeFrame, month, year],
        queryFn: () => fetchPriceAdjustments(user.token, timeFrame, month, year),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
