
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/config';
import { useAuth } from '../../../../context/authContext';

const fetchEmployeeKPIs = async (token, id, year = new Date().getFullYear()) => {
    const { data } = await axiosInstance.get(
        `kpi/employee/${id}/performance?year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return data?.data;
};

export const useEmployeeKpiBarChart = (id, year) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['useEmployeeKpiBarChart', id, year],
        queryFn: () => fetchEmployeeKPIs(user.token, id, year),
        enabled: !!user?.token && !!id,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    });
};

// import { useQuery } from '@tanstack/react-query';
// import axiosInstance from '../../../../api/config';
// import { useAuth } from '../../../../context/authContext';

// const fetchEmployeeKPIs = async (token, id) => {


//     const { data } = await axiosInstance.get(`kpi/employee/${id}/performance`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });

//     return data?.data;
// };

// export const useEmployeeKpiBarChart = (id) => {
//     const { user } = useAuth();

//     return useQuery({
//         queryKey: ['useEmployeeKpiBarChart', id],
//         queryFn: () => fetchEmployeeKPIs(user.token, id),
//         enabled: !!user?.token && !!id,
//         staleTime: 1000 * 60 * 5,
//         cacheTime: 1000 * 60 * 10,
//     });
// };
