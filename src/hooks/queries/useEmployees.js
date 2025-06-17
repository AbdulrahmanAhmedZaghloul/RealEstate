import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchEmployees = async (token) => {
    const { data } = await axiosInstance.get("employees", {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log(data);
    
    return data;
};

export const useEmployees = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['employees'],
        queryFn: () => fetchEmployees(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
