// hooks/useAddProperty.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { notifications } from '@mantine/notifications';

export const useAddContract = (userToken, closeModal) => {
  const queryClient = useQueryClient();

  const addContract = async (values) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (key === "contract_document") {
        formData.append(key, values[key]); // Append the file
      }
      if (key === "release_date") {
        formData.append(key, values[key]);
        formData.append("creation_date", values[key]);
      } else {
        formData.append(key, values[key]);
      }
    });

    await axiosInstance
      .post("/api/v1/contracts", formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      })

  };

  return useMutation({
    mutationFn: addContract,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      closeModal?.();
      // form.reset()
      notifications.show({
        title: 'Contract Added',
        message: 'Contract has been added successfully.',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to add contract.',
        color: 'red',
      });
      console.error(error);
    },
  });
};
