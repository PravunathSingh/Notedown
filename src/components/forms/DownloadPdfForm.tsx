import React from 'react';
import { Button, TextInput } from '@mantine/core';

export interface DownloadPdfFormProps {
  onSubmit: (pdfFileName: string) => void;
  onClose: () => void;
  isLoading?: boolean;
}

const DownloadPdfForm: React.FC<DownloadPdfFormProps> = ({
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [pdfFileName, setPdfFileName] = React.useState('');
  const [pdfFileNameError, setPdfFileNameError] = React.useState('');

  const handlePdfFileNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPdfFileNameError('');
    setPdfFileName(event.target.value);
  };

  const handleFormSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (pdfFileName.trim() === '') {
      setPdfFileNameError('PDF file name cannot be empty');
      return;
    } else if (pdfFileName.trim().length > 50) {
      setPdfFileNameError('PDF file name cannot be greater than 50 characters');
      return;
    }
    onSubmit(pdfFileName);
  };

  return (
    <form noValidate onSubmit={handleFormSubmit}>
      <TextInput
        required
        label='PDF file name'
        placeholder='Enter PDF file name'
        value={pdfFileName}
        onChange={handlePdfFileNameChange}
        error={pdfFileNameError}
        className='mb-5'
      />

      <div className='flex gap-3 max-w-max ml-auto'>
        <Button
          loading={isLoading}
          loaderProps={{
            color: 'white',
          }}
          type='submit'
          color='dark'
          size='xs'
        >
          Download
        </Button>
        <Button
          type='button'
          variant='outline'
          size='xs'
          color='gray'
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default DownloadPdfForm;
