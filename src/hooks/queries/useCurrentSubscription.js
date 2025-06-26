// hooks/queries/useCurrentSubscription.js
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchCurrentSubscription = async (token) => {

    const { data } = await axiosInstance.get("stripe/products", {
        headers: { Authorization: `Bearer ${token}` },
    });

    // نفترض أن أول عنصر في المصفوفة هو الخطة الحالية
  
    console.log(data);

    return data;

};

export const useCurrentSubscription = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['currentSubscription'],
        queryFn: () => fetchCurrentSubscription(user.token),
        staleTime: 1000 * 60 * 5, // 5 دقائق
        cacheTime: 1000 * 60 * 10, // 10 دقائق
        enabled: !!user?.token,
    });
};  