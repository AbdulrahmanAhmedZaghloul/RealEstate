import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchContracts = async (token) => {
    const { data } = await axiosInstance.get("contracts", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

export const useContracts = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['contracts'],
        queryFn: () => fetchContracts(user.token),

        staleTime: 0,
        cacheTime: 1000 * 60 * 5,
        enabled: !!user?.token,
        refetchInterval: 1000 * 10, // إعادة جلب البيانات كل 30 ثانية
        refetchOnWindowFocus: false, // إيقاف إعادة الجلب عند تركيز النافذة
        // staleTime: 1000 * 60 * 5, // 5 minutes
        // cacheTime: 1000 * 60 * 10, // 10 minutes
        // enabled: !!user?.token,
    });
};
