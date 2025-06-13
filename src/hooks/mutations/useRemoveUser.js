 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { notifications } from '@mantine/notifications';
import InvalidateQuery from '../../InvalidateQuery/InvalidateQuery';

export const useRemoveUser = (userToken, closeModal) => {
  const queryClient = useQueryClient();

  const removeUser = async ({ employeeToDelete }) => {
    const { userId, isSupervisor } = employeeToDelete;

    const endpoint = isSupervisor
      ? `supervisors/${userId}`
      : `employees/${userId}`;

    await axiosInstance.delete(endpoint, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    return { userId, isSupervisor };
  };

  return useMutation({
    mutationFn: removeUser,
    onSuccess: ({ userId, isSupervisor }) => {
      // Update the cached data directly instead of invalidating
      if (isSupervisor) {
        queryClient.setQueryData(['supervisors'], (oldData) => {
          // <InvalidateQuery queryKey={["listings"]} />

          return {
            ...oldData,
            data: {
              ...oldData.data,
              supervisors: oldData.data.supervisors.filter(
                (supervisor) => supervisor.supervisor_id !== userId
              ),
            },
          };
        });
      } else {
        queryClient.setQueryData(['employees'], (oldData) => {
          // <InvalidateQuery queryKey={["listings"]} />

          return {
            ...oldData,
            data: {
              ...oldData.data,
              employees: oldData.data.employees.filter(
                (employee) => employee.employee_id !== userId
              ),
            },
          };
        });
      }

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
      console.error('Error removing user:', error);
    },
  });
};
