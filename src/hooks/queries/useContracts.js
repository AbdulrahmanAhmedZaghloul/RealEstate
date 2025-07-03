

import { useInfiniteQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchContracts = (token, cursor, filters) => async () => {
  const params = {
    limit: 6,
    cursor: cursor || 0,

    // General search
    search: filters.search || undefined,

    // Specific filters
    title: filters.title || undefined,
    customer_name: filters.customer_name || undefined,
    location: filters.location || undefined,
    contract_type: filters.contract_type !== 'all' ? filters.contract_type : undefined,
    employee_name: filters.employee_name || undefined,
    category_id: filters.category_id || undefined,

    // Date range
    date_from: filters.date_from || undefined,
    date_to: filters.date_to || undefined,

    // Status
    status: filters.status !== 'all' ? filters.status : undefined,
  };

  const response = await axiosInstance.get('contracts', {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });

  return response.data;
};

export const useContracts = (filters) => {
  const { user } = useAuth();
  const token = user?.token;

  return useInfiniteQuery({
    queryKey: ['contracts', filters],
    queryFn: ({ pageParam = 0 }) => fetchContracts(token, pageParam, filters)(),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.data?.pagination;
      if (pagination && pagination.has_more) {
        return pagination.next_cursor;
      }
      return undefined;
    },
    staleTime: 0,
    cacheTime: 1000 * 60 * 5,
    enabled: !!token,
  });
};


// import { useInfiniteQuery } from '@tanstack/react-query';
// import axiosInstance from '../../api/config';
// import { useAuth } from '../../context/authContext';

// const fetchContracts = (token, cursor) => async () => {
//   const params = {
//     limit: 6,
//     cursor: cursor || 0,
//   };

//   const response = await axiosInstance.get('contracts', {
//     headers: { Authorization: `Bearer ${token}` },
//     params,
//   });

//   return response.data;
// };

// export const useContracts = () => {
//   const { user } = useAuth();
//   const token = user?.token;

//   return useInfiniteQuery({
//     queryKey: ['contracts'],
//     queryFn: ({ pageParam = 0 }) => fetchContracts(token, pageParam)(),
//     initialPageParam: 0,
//     getNextPageParam: (lastPage) => {
//       const pagination = lastPage?.data?.pagination;
//       if (pagination && pagination.has_more) {
//         return pagination.next_cursor;
//       }
//       return undefined;
//     },
//     staleTime: 0,
//     cacheTime: 1000 * 60 * 5,
//     enabled: !!token,
//   });
// };



















// // hooks/queries/useContracts.js



// // hooks/queries/useContracts.js
// import { useInfiniteQuery } from '@tanstack/react-query';
// import axiosInstance from '../../api/config';
// import { useAuth } from '../../context/authContext';

// const fetchContracts = (token, cursor, filters) => async () => {
//   const params = {
//     limit: 6,
//     cursor: cursor || 0,

//     // Search & Filters
//     search: filters.search || undefined,
//     customer_name: filters.customer_name || undefined,
//     location: filters.location || undefined,
//     status: filters.status !== 'all' ? filters.status : undefined,
//     contract_type: filters.contract_type !== 'all' ? filters.contract_type : undefined,

//     // Sort
//     sort_by: filters.sort_by || undefined,
//     sort_dir: filters.sort_dir || undefined,
//   };

//   const response = await axiosInstance.get('contracts', {
//     headers: { Authorization: `Bearer ${token}` },
//     params,
//   });
//   console.log(response.data);

//   return response.data;

// };

// export const useContracts = (filters) => {
//   const { user } = useAuth();
//   const token = user?.token;

//   return useInfiniteQuery({
//     queryKey: ['contracts', filters],
//     queryFn: ({ pageParam = 0 }) => fetchContracts(token, pageParam, filters)(),
//     initialPageParam: 0,
//     getNextPageParam: (lastPage) => {
//       const pagination = lastPage?.data?.pagination;
//       if (pagination && pagination.has_more) {
//         return pagination.next_cursor;
//       }
//       return undefined;
//     },
//     staleTime: 0,
//     cacheTime: 1000 * 60 * 5,
//     enabled: !!token,
//   });
// };
