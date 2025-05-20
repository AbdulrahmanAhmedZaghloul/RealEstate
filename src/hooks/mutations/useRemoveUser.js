// hooks/useAddProperty.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { notifications } from '@mantine/notifications';

export const useRemoveUser = (userToken, closeModal) => {
    const queryClient = useQueryClient();

    const removeUser = async ({ employeeToDelete }) => {
        const { userId, isSupervisor } = employeeToDelete;

        const endpoint = isSupervisor
            ? `/api/supervisors/${userId}`
            : `/api/employees/${userId}`;
        await axiosInstance.delete(endpoint, {
            headers: { Authorization: `Bearer ${userToken}` },
        });
        return {isSupervisor};
    }


    return useMutation({
        mutationFn: removeUser,
        onSuccess: (data) => {
            data.isSupervisor ? queryClient.invalidateQueries({ queryKey: ['supervisors'] }) : queryClient.invalidateQueries({ queryKey: ['employees'] });
            closeModal?.();
            notifications.show({
                title: 'User Removed',
                message: 'User has been removed successfully.',
                color: 'green',
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to remove user.',
                color: 'red',
            });
            console.error(error);
        },
    });
};
