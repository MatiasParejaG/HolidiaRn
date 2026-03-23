import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '../api/client';

type ToggleFavoriteParams = {
  propertyId: string;
  currentFavoriteStatus: boolean;
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId }: ToggleFavoriteParams) => {
      const { data } = await client.post(`/favorites/${propertyId}`);
      return data;
    },
    onMutate: async ({ currentFavoriteStatus, propertyId }: ToggleFavoriteParams) => {
      await queryClient.cancelQueries({
        queryKey: ['properties'],
      });
      const previousProperties = queryClient.getQueryData<Property[]>(['properties']);
      queryClient.setQueryData<Property[]>(['properties'], (old) => {
        if (!old) {
          return [];
        }
        return old.map((property) => {
          if (property.id === propertyId) {
            return {
              ...property,
              is_favorite: !currentFavoriteStatus,
            };
          }
          return property;
        });
      });
      return {
        previousProperties,
      };
    },

    onError: (err, variables, context) => {
      if (context?.previousProperties) {
        queryClient.setQueryData(['properties'], context.previousProperties);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['properties'],
      });
    },
  });
};
