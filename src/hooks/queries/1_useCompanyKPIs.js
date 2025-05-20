import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { useAuth } from '../../context/authContext';

const fetchCompanyKPIs = async (token) => {
    const { data } = await axiosInstance.get("/api/kpi/company?time_frame=yearly", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return data;
};

export const useCompanyKPIs = () => {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['companyKPIs'],
        queryFn: () => fetchCompanyKPIs(user.token),
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!user?.token,
    });
};
