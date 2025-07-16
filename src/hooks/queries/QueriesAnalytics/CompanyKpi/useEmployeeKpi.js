import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/config';
import { useAuth } from '../../../../context/authContext';

const fetchCompanyKPIs = async (token, id, timeFrame = "yearly", month = "", year = "") => {
  const params = new URLSearchParams({ time_frame: timeFrame });

  if (timeFrame === 'year' && year) {
    params.append('year', year);
  } else if (timeFrame === 'month' && month && year) {
    params.append('month', month);
    params.append('year', year);
  }

  const { data } = await axiosInstance.get(`kpi/employee/${id}/performance?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return data?.data;
};

export const useEmployeeKpi = (id, timeFrame = "yearly", month = "", year = "") => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['EmployeeKpi', id, timeFrame, month, year],
    queryFn: () => fetchCompanyKPIs(user.token, id, timeFrame, month, year),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    enabled: !!user?.token && !!id,
  });
};
// // hooks/queries/QueriesAnalytics/CompanyKpi/useSellingKpi.js
// import { useQuery } from '@tanstack/react-query';
// import { useAuth } from '../../../../context/authContext';
// import axiosInstance from '../../../../api/config';
// // import axiosInstance from '../../../../api/config';

// const fetchCompanyKPIs = async (token, timeFrame, month, year , id) => {

//     const params = new URLSearchParams({ time_frame: timeFrame });

//     if (timeFrame === 'year' && year) {
//         params.append('year', year);
//     } else if (timeFrame === 'month' && month && year) {
//         params.append('month', month);
//         params.append('year', year);
//     }

//     const { data } = await axiosInstance.get(`kpi/employee/${id}/performance?${params.toString()}`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });

//     return data?.data;
// };

// export const useEmployeeKpi = (id, timeFrame = "yearly", month = "", year = "") => {
//     const { user } = useAuth();

//     return useQuery({
//         queryKey: ['EmployeeKpi', id,timeFrame, month, year ],
//         queryFn: () => fetchCompanyKPIs(user.token,id, timeFrame, month, year ),
//         staleTime: 1000 * 60 * 5,
//         cacheTime: 1000 * 60 * 10,
//         enabled: !!user?.token && !!id,
//     });
// };
 
// // import { useQuery } from '@tanstack/react-query';
// // import axiosInstance from '../../../../api/config';
// // import { useAuth } from '../../../../context/authContext';

// // const fetchEmployeeKPIs = async (token, id ) => {
 
// //     const { data } = await axiosInstance.get(`kpi/employee/${id}/performance?time_frame=yearly`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //     });

// //     return data?.data;
// // };

// // export const useEmployeeKpi = (id) => {
// //     const { user } = useAuth();

// //     return useQuery({
// //         queryKey: ['EmployeeKpi', id ],
// //         queryFn: () => fetchEmployeeKPIs(user.token, id),
// //         enabled: !!user?.token && !!id,
// //         staleTime: 1000 * 60 * 5,
// //         cacheTime: 1000 * 60 * 10,
// //     });
// // };
