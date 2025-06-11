// hooks/useAddProperty.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

export const useEditPlan = (userToken) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const editPlan = async (planId, autoRenew) => {

        await axiosInstance.post(
            "api/v1/subscriptions/subscribe",
            {
              plan_id: planId,
              payment_method: "stripe",
              auto_renew: autoRenew,
            },
            {
              headers: { Authorization: `Bearer ${userToken}` },
            }
          );
    };


    return useMutation({
        mutationFn: editPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentSubscription'] });
            notifications.show({
                title: 'Subscription successful!',
                message: 'You have successfully subscribed to the plan.',
                color: 'green',
            });
            navigate("/dashboard");

        },
        onError: (error) => {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to subscribe to plan.',
                color: 'red',
            });
            console.error(error);
        },
    });
};
