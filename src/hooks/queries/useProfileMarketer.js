
// useProfileMarketer.js
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchProfile = async (token) => {
    const { data } = await axiosInstance.get("marketer/profile", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

export const useProfileMarketer = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['profile-marketer'],
        queryFn: () => fetchProfile(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
