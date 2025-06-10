import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { notifications } from '@mantine/notifications';

export const useEditUser = (userToken, closeModal) => {
    const queryClient = useQueryClient();

    const editUser = async ({ editUser }) => {
        const formData = new FormData();
        formData.append("name", editUser.name);
        formData.append("email", editUser.email);
        formData.append("password", editUser.password);
        formData.append("position", editUser.position);
        formData.append("phone_number", editUser.phone_number);
        formData.append("address", editUser.address);
        formData.append("supervisor_id", editUser.supervisor_id);

        formData.append("_method", "put");

        if (editUser.image instanceof File) {
            formData.append("picture", editUser.image);
        } const endpoint =
            editUser.id !== undefined
                ? `api/v1/employees/${editUser.id}`
                : `api/v1/supervisors/${editUser.supervisor_id}`;

        await   axiosInstance.post(endpoint, formData, {
            headers: { Authorization: `Bearer ${userToken}` },
        });

        const isSupervisor = editUser.id === undefined;
        return { isSupervisor };
    };


    return useMutation({
        mutationFn: editUser,
        onSuccess: (data) => {
            data.isSupervisor ? queryClient.invalidateQueries({ queryKey: ['supervisors'] }) : queryClient.invalidateQueries({ queryKey: ['employees'] });
            closeModal?.();
            notifications.show({
                title: 'User Edited',
                message: 'User has been edited successfully.',
                color: 'green',
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to edit user.',
                color: 'red',
            });
            console.error(error);
        },
    });
};
