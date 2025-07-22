import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../api/config';
import { useAuth } from '../../../context/authContext';
// import axiosInstance from '../../api/config';
// import { useAuth } from '../../context/authContext';

const fetchCompanyKPIs = async (token) => {
  
      const { data } = await axiosInstance.get(`crm/kpis`, {
            headers: { Authorization: `Bearer ${token}` },
      });
      return data;
};

export const useRequestsKPIs = ( ) => {
      const { user } = useAuth();

      return useQuery({
            queryKey: ['RequestsKPIs' ],
            queryFn: () => fetchCompanyKPIs(user.token ),
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 10, // 10 minutes
            enabled: !!user?.token,
      });
};
