import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchNewlyListed = async (token) => {
    const { data } = await axiosInstance.get("api/v1/kpi/newly-listed?time_frame=yearly", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

export const useNewlyListed = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['newlyListed'],
        queryFn: () => fetchNewlyListed(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
