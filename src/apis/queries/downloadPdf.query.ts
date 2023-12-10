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

      const resData = await res.json();
      console.log(resData);

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
