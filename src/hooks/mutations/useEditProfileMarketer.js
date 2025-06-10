
// hooks/useEditProfileMarketer.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { notifications } from '@mantine/notifications';

export const useEditProfileMarketer = (userToken, closeModal, setLoading) => {
    const queryClient = useQueryClient();

    const editProfile = async (formData) => {

        await axiosInstance.post("api/v1/marketer/profile/update", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${userToken}`,
            },
        }
        );
    };


    return useMutation({
        mutationFn: editProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile-marketer'] });
            closeModal?.();
            notifications.show({
                title: 'Profile Updated',
                message: 'Profile has been updated successfully.',
                color: 'green',
            });
        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to update profile.',
                color: 'red',
            });
            console.error(error);
        },
    });
};
