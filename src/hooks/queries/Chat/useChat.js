

import { useQuery } from "@tanstack/react-query"; 
import { useAuth } from "../../../context/authContext";
import axiosInstance from "../../../api/config";
const fetchChat = async ({ token,  }) => {
       

      const { data } = await axiosInstance.get("chat/users", {
            headers: { Authorization: `Bearer ${token}` },
           
            
      });
       
      return data;
};
 
export const useChat = () => {
      const { user } = useAuth();

      return useQuery({
             queryKey: ["useChat",  user?.token],
            queryFn: () => fetchChat({ token: user.token, }),
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 10,
            enabled: !!user?.token,
            keepPreviousData: true,
      });
};

 