

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../../api/config";
import { useAuth } from "../../../context/authContext"; 
const fetchClientRequests = async ({ token, page, filters = {} }) => {
       const params = { page };

       Object.keys(filters).forEach(key => {
            if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
                  params[key] = filters[key];
            }
      });

      const { data } = await axiosInstance.get("crm", {
            headers: { Authorization: `Bearer ${token}` },
            params,  
      });
      return data;
};
 
export const useClientRequests = (page = 1, filters = {}) => {
      const { user } = useAuth();

      return useQuery({
             queryKey: ["client-requests", page, filters, user?.token],
            queryFn: () => fetchClientRequests({ token: user.token, page, filters }),
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 10,
            enabled: !!user?.token,
            keepPreviousData: true,
      });
};

 