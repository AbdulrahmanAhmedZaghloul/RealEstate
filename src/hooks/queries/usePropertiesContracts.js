

import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchListings = async (token) => {
    const { data } = await axiosInstance.get("api/v1/listings/cursor", {
        headers: { Authorization: `Bearer ${token}` },
    });
    console.log(data);
    
    return data;
};

export const usePropertiesContracts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['listings'],
    queryFn: () => fetchListings(user.token),
    staleTime: 0,
    cacheTime: 1000 * 60 * 5,
    enabled: !!user?.token,
    // refetchInterval: 1000 * 1000, // إعادة جلب البيانات كل 30 ثانية
    refetchOnWindowFocus: false, // إيقاف إعادة الجلب عند تركيز النافذة
  });
};