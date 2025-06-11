// hooks/useAddProperty.js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../api/config';
import { notifications } from '@mantine/notifications';

export const useAddProperty = (userToken, categories, closeModal) => {
  const queryClient = useQueryClient();

  const addProperty = async (values) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (key === 'images') {
        values.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      } else if (
        key === 'category_id' ||
        key === 'subcategory_id' ||
        key === 'employee_id'
      ) {
        formData.append(key, parseInt(values[key]));
      } else if (key === 'selectedAmenities') {
        values[key].forEach((amenity) => {
          formData.append('amenities[]', amenity.id);
        });
      } else if (key !== 'amenities') {
        formData.append(key, values[key]);
      }
    });

    formData.append('primary_image_index', 0);
    formData.append(
      'category',
      categories.find((cat) => cat.id === parseInt(values.category_id))?.name || ''
    );

    const { data } = await axiosInstance.post('api/v1/listings/company', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userToken}`,
      },
    });

    return data;
  };

  return useMutation({
    mutationFn: addProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['listingsRealEstate'] });
      closeModal?.();
      notifications.show({
        title: 'Property Added',
        message: 'Property has been added successfully.',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to add property.',
        color: 'red',
      });
      console.error(error);
    },
  });
};
