import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../../api/config";
import { useAuth } from "../../../context/authContext";

const deleteClientRequest = async ({ token, id }) => {
      const { data } = await axiosInstance.delete(`crm/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
      });
      return data; // { status, message }
};

export const useDeleteClientRequest = () => {
      const { user } = useAuth();
      const queryClient = useQueryClient();

      return useMutation({
            mutationFn: (id) => deleteClientRequest({ token: user.token, id }),
            onSuccess: () => {
                  queryClient.invalidateQueries({ queryKey: ["client-requests"] });
            },
      });
};
