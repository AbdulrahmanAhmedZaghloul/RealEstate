// hooks/useAddProperty.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { notifications } from '@mantine/notifications';

export const useAddUser = (userToken, closeModal, setNewUser) => {
    const queryClient = useQueryClient();

    const addUser = async ({ newUser, isSupervisor }) => {

        const formData = new FormData();
        formData.append("name", newUser.name);
        formData.append("email", newUser.email);
        formData.append("password", newUser.password);
        formData.append("position", newUser.position);
        formData.append("phone_number", newUser.phone_number);
        formData.append("address", newUser.address);
        formData.append("supervisor_id", newUser.supervisor_id);

        console.log(isSupervisor);
        if (newUser.image) formData.append("picture", newUser.image);

        const endpoint = isSupervisor ? "api/v1/supervisors" : "api/v1/employees";
        const response = await axiosInstance.post(endpoint, formData, {
            headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "multipart/form-data",
            },
        });
        console.log("Response from addUser:", response.data);

        setNewUser({
            name: "",
            email: "",
            password: "",
            position: "employee",
            phone_number: "",
            address: "",
            image: null,
            supervisor_id: null,
        });
        return { isSupervisor };

    }


    return useMutation({
        mutationFn: addUser,
        onSuccess: (data) => {
            data.isSupervisor ? queryClient.invalidateQueries({ queryKey: ['supervisors'] }) : queryClient.invalidateQueries({ queryKey: ['employees'] });
            closeModal?.();
            notifications.show({
                title: 'User Added',
                message: 'User has been added successfully.',
                color: 'green',
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to add user.',
                color: 'red',
            });
            console.error(error);
        },
    });
};
