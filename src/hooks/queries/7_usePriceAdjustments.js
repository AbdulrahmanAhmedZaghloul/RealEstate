import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchPriceAdjustments = async (token) => {
    const { data } = await axiosInstance.get("/api/kpi/price-adjustments?time_frame=yearly", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

export const usePriceAdjustments = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['priceAdjustments'],
        queryFn: () => fetchPriceAdjustments(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
