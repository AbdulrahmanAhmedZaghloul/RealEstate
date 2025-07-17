import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/config';
import { useAuth } from '../../../../context/authContext';

const fetchEmployeeKPIs = async (token, id, start_date, end_date) => {
    const { data } = await axiosInstance.get(
        `kpi/employee/${id}/performance?start_date=${start_date}&end_date=${end_date}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return data?.data;
};

export const useEmployeeKpiBarChart = (id, start_date, end_date) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['useEmployeeKpiBarChart', id, start_date, end_date],
        queryFn: () => fetchEmployeeKPIs(user.token, id, start_date, end_date),
        enabled: !!user?.token && !!id && !!start_date && !!end_date,
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
