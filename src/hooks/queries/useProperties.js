import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchListings = async (token) => {
    const { data } = await axiosInstance.get("/api/listings", {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log(data);
    
    return data;
};

export const useProperties = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['listings'],
        queryFn: () => fetchListings(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
