import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchEmployeePerformance = async (token) => {
    const { data } = await axiosInstance.get("kpi/employee-performance", {
        headers: { Authorization: `Bearer ${token}` },
    });
    
    return data;
};

export const useEmployeePerformance = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['employeePerformance'],
        queryFn: () => fetchEmployeePerformance(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
