import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchCategoryPerformance = async (token) => {
    const { data } = await axiosInstance.get("api/v1/kpi/category-performance?time_frame=yearly", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

export const useCategoryPerformance = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['categoryPerformance'],
        queryFn: () => fetchCategoryPerformance(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
