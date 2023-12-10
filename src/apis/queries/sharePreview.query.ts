import { useMutation, useQuery } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

export const useSharePreview = () => {
  return useMutation({
    mutationFn: async (data: { type: 'md' | 'parsed'; doc: string }) => {
      const res = await fetch('/api/createPreview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const resData = await res.json();
      return resData;
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message,
        color: 'red',
      });
    },
  });
};

export const useGetPreview = (fileName: string) => {
  return useQuery({
    queryKey: ['getPreview', fileName],
    queryFn: async () => {
      const res = await fetch(`/api/getPreview?fileName=${fileName}`, {
        method: 'GET',
      });

      const resData = await res.json();
      return resData;
    },
    enabled: !!fileName,
  });
};
