// hooks/queries/useCurrentSubscription.js
import { useQuery } from '@tanstack/react-query';
// import axiosInstance from '../../api/config';
// import { useAuth } from '../../context/authContext';
import axiosInstance from '../../../api/config';

const fetchCurrentSubscription = async (token) => {

    const { data } = await axiosInstance.get("stripe/products"
    //     , {
    //     headers: { Authorization: `Bearer ${token}` },
    // }
);

    // نفترض أن أول عنصر في المصفوفة هو الخطة الحالية
  
    console.log(data);

    return data;

};

export const useHomeSubscription = () => {
    // const { user } = useAuth();

    return useQuery({
        queryKey: ['HomeSubscription'],
        queryFn: () => fetchCurrentSubscription(),
        staleTime: 1000 * 60 * 5, // 5 دقائق
        cacheTime: 1000 * 60 * 10, // 10 دقائق
        // enabled: !!user?.token,
    });
};  