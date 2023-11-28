import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';

export const useDownloadPdf = () => {
  return useMutation({
    mutationFn: async (data: { fileName: string; doc: string }) => {
      const res = await fetch('/api/downloadPdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const blob = await res.blob();

      return blob;
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
