// hooks/queries/Requests/useTableClientRequests.js


import { useQuery } from '@tanstack/react-query';
// import axiosInstance from '../../../api/config';
import { useAuth } from '../../../context/authContext'; 
import axiosInstance from '../../../api/config';

const fetchCompanyKPIs = async (token) => {
      const { data } = await axiosInstance.get(`crm`, {
            headers: { Authorization: `Bearer ${token}` },
      });
      return data?.data?.client_requests; // نرجع فقط client_requests الذي يحتوي على.pagination
};

export const useTableClientRequests = () => {
      const { user } = useAuth();
      return useQuery({
            queryKey: ['RequestsKPIs'],
            queryFn: () => fetchCompanyKPIs(user.token),
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 10,
            enabled: !!user?.token,
      });
};

// import { useQuery } from '@tanstack/react-query';
// import axiosInstance from '../../../api/config';
// import { useAuth } from '../../../context/authContext'; 

// const fetchCompanyKPIs = async (token) => {
  
//       const { data } = await axiosInstance.get(`crm`, {
//             headers: { Authorization: `Bearer ${token}` },
//       });
//       return data;
// };

// export const useTableClientRequests = ( ) => {
//       const { user } = useAuth();

//       return useQuery({
//             queryKey: ['RequestsKPIs' ],
//             queryFn: () => fetchCompanyKPIs(user.token ),
//             staleTime: 1000 * 60 * 5, // 5 minutes
//             cacheTime: 1000 * 60 * 10, // 10 minutes
//             enabled: !!user?.token,
//       });
// };
