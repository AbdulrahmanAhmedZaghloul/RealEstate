import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchTimeOnMarket = async (token) => {
    const { data } = await axiosInstance.get("/api/kpi/time-on-market?time_frame=yearly", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

export const useTimeOnMarket = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['timeOnMarket'],
        queryFn: () => fetchTimeOnMarket(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
