import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchSupervisors = async (token) => {
    const { data } = await axiosInstance.get("api/v1/supervisors", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

export const useSupervisors = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['supervisors'],
        queryFn: () => fetchSupervisors(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
