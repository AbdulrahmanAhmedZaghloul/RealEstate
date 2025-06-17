/// useContracts.jsx

import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchContracts = (token, filters = {}) => async ({ pageParam = 0 }) => {
  const params = new URLSearchParams();

  // Filters
  if (filters.search) params.append('search', filters.search);
    if (filters.contract_type && filters.contract_type !== 'all') {
    params.append('contract_type', filters.contract_type);
  }

  if (filters.title) params.append('title', filters.title);
  if (filters.customer_name) params.append('customer_name', filters.customer_name);
  if (filters.employee_name) params.append('employee_name', filters.employee_name);
  if (filters.location) params.append('location', filters.location);
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.contract_type && filters.contract_type !== 'all') params.append('contract_type', filters.contract_type);
  if (filters.creation_date) params.append('creation_date', filters.creation_date);
  if (filters.effective_date) params.append('effective_date', filters.effective_date);
  if (filters.expiration_date) params.append('expiration_date', filters.expiration_date);


    // Sorting
  if (filters.sort_by) params.append('sort_by', filters.sort_by);
  if (filters.sort_dir) params.append('sort_dir', filters.sort_dir);

  
  // Pagination
  params.append('limit', 2);
  params.append('cursor', pageParam);

  const { data } = await axiosInstance.get(`contracts?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },

  });


  return {
  contracts: data.data || [],
  nextCursor: data.pagination?.next_cursor ?? undefined,
  hasMore: Boolean(data.pagination?.has_more), // ضمان قيمة boolean
};
  // return {
  //   contracts: data.data || [],
  //   nextCursor: data.pagination?.next_cursor,
  //   hasMore: data.pagination?.has_more ?? false,
  // };
};

export const useContracts = (filters = {}) => {
  const { user } = useAuth();
  const token = user?.token;

  return useInfiniteQuery({
    queryKey: ['contracts', filters],
    queryFn: fetchContracts(token, filters),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
  return lastPage.hasMore ? lastPage.nextCursor : null;    },
    enabled: !!token,
    staleTime: 0,
    cacheTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};


// import { useInfiniteQuery } from '@tanstack/react-query';
// import axiosInstance from '../../api/config';
// import { useAuth } from '../../context/authContext';

// const fetchContracts = (token) => async ({ pageParam = 0 }) => {
//     console.log(token);

//   const { data } = await axiosInstance.get(`contracts?limit=2&cursor=${pageParam}`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   console.log("API Response:", data); // للتأكد من هيكل البيانات

//   return {
//     contracts: data?.data?.data || [],
//     nextCursor: data?.data?.pagination?.next_cursor,
//     hasMore: data?.data?.pagination?.has_more ?? false,
//   };
// };

// export const useContracts = () => {
//   const { user } = useAuth();
//   const token = user?.token;
// console.log();

//   return useInfiniteQuery({
//     queryKey: ['contracts'],
//     queryFn: fetchContracts(token), // تمرير التوكن قبل تنفيذ الدالة
//     initialPageParam: 0,
//     getNextPageParam: (lastPage) => {
//       return lastPage.hasMore ? lastPage.nextCursor : undefined;
//     },
//     enabled: !!token, // لن يُنفذ الاستعلام إذا لم يكن هناك توكن
//     staleTime: 0,
//     cacheTime: 1000 * 60 * 5,
//   });
// }; 