import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchTerminationReasons = async (token) => {
    const { data } = await axiosInstance.get("kpi/termination-Reasons?time_frame=yearly", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

export const useTerminationReasons = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['terminationReasons'],
        queryFn: () => fetchTerminationReasons(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
