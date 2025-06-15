
// useContracts
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';


const fetchContracts = async (token, filters = {}) => {
  const params = new URLSearchParams();

  // General search
  if (filters.search) {
    params.append('search', filters.search);
  }

  // Specific fields
  if (filters.title) params.append('title', filters.title);
  if (filters.customer_name) params.append('customer_name', filters.customer_name);
  if (filters.employee_name) params.append('employee_name', filters.employee_name);
  if (filters.location) params.append('location', filters.location);

  // Status and type
  if (filters.status) params.append('status', filters.status);
  if (filters.contract_type) params.append('contract_type', filters.contract_type);

  // Date filters
  if (filters.creation_date) params.append('creation_date', filters.creation_date);
  if (filters.effective_date) params.append('effective_date', filters.effective_date);
  if (filters.expiration_date) params.append('expiration_date', filters.expiration_date);

  const { data } = await axiosInstance.get(`contracts?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data.data || [];
};

export const useContracts = (filters = {}) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['contracts', filters],
    queryFn: () => fetchContracts(user.token, filters),
    enabled: !!user?.token,
    staleTime: 0,
    cacheTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 10,
    refetchOnWindowFocus: false,
  });
};


// const fetchContracts = async (token) => {
//     const { data } = await axiosInstance.get("contracts", {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     console.log(data.data);
    
//     //   return Array.isArray(data?.data) ? data.data : [];

//     return data.data;
// };

// export const useContracts = () => {
//     const { user } = useAuth();

//     return useQuery({
//         queryKey: ['contracts'],
//         queryFn: () => fetchContracts(user.token),

//         staleTime: 0,
//         cacheTime: 1000 * 60 * 5,
//         enabled: !!user?.token,
//         refetchInterval: 1000 * 10, // إعادة جلب البيانات كل 30 ثانية
//         refetchOnWindowFocus: false, // إيقاف إعادة الجلب عند تركيز النافذة
//         // staleTime: 1000 * 60 * 5, // 5 minutes
//         // cacheTime: 1000 * 60 * 10, // 10 minutes
//         // enabled: !!user?.token,
//     });
// };



