
// useProfile.js
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchProfile = async (token) => {
    const { data } = await axiosInstance.get("company/profile", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

export const useProfile = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['profile'],
        queryFn: () => fetchProfile(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
