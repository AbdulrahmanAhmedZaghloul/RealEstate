import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchContracts = async (token) => {
    const { data } = await axiosInstance.get("/api/contracts", {
        headers: { Authorization: `Bearer ${token}` },
    });
     console.log(data.data);
    return data;
};

export const useContracts = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['contracts'],
        queryFn: () => fetchContracts(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
