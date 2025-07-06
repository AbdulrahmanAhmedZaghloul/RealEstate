import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../../../api/config';
import { useAuth } from '../../../../context/authContext';

const fetchEmployeeKPIs = async (token, id, timeFrame, month, year) => {
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

export const useEmployeeKpi = (id,timeFrame = "yearly", month = "", year = "") => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['EmployeeKpi', id ,, timeFrame, month, year],
        queryFn: () => fetchEmployeeKPIs(user.token, id, timeFrame, month, year),
        enabled: !!user?.token && !!id,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
    });
};
