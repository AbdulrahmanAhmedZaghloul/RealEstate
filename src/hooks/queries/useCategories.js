// useCategories
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchCategories = async (token) => {
    const { data } = await axiosInstance.get("categories?with_subcategories=true", {
        headers: { Authorization: `Bearer ${token}` },
    });
    
    return data;
};

export const useCategories = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['categories'],
        queryFn: () => fetchCategories(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
