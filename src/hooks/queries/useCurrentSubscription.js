import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchCurrentSubscription = async (token) => {
    const { data } = await axiosInstance.get("stripe/subscriptions/plans", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

export const useCurrentSubscription = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['currentSubscription'],
        queryFn: () => fetchCurrentSubscription(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
