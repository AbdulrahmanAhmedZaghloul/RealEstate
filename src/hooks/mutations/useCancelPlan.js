// hooks/useAddProperty.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

export const useCancelPlan = (userToken) => {
    const queryClient = useQueryClient();

    const cancelPlan = async () => {

        await axiosInstance.post(
            "subscriptions/cancel",
            {},
            {
                headers: { Authorization: `Bearer ${userToken}` },
            }
        );
    };


    return useMutation({
        mutationFn: cancelPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentSubscription'] });
            notifications.show({
                title: 'Subscription canceled.',
                message: 'You have successfully cancelled subscription.',
                color: 'green',
            });

        },
        onError: (error) => {
            console.log(error);
            
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to cancel subscription',
                color: 'red',
            });
            console.error(error);
        },
    });
};
