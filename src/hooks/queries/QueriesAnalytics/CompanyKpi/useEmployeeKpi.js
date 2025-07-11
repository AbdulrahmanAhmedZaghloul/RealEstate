import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/config';
import { useAuth } from '../../../../context/authContext';

const fetchEmployeeKPIs = async (token, id ) => {
 
    const { data } = await axiosInstance.get(`kpi/employee/${id}/performance?time_frame=yearly`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return data?.data;
};

export const useEmployeeKpi = (id) => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['EmployeeKpi', id ],
        queryFn: () => fetchEmployeeKPIs(user.token, id),
        enabled: !!user?.token && !!id,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    });
};
