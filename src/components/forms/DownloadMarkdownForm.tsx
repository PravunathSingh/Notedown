import { Button, TextInput } from '@mantine/core';
import React from 'react';

export interface DownloadMarkdownFormProps {
  onSubmit: (markdownFileName: string) => void;
  onClose: () => void;
}

const DownloadMarkdownForm: React.FC<DownloadMarkdownFormProps> = ({
  onClose,
  onSubmit,
}) => {
  const [markdownFileName, setMarkdownFileName] = React.useState('');
  const [markdownFileNameError, setMarkdownFileNameError] = React.useState('');

  const handleMarkdownFileNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMarkdownFileNameError('');
    setMarkdownFileName(event.target.value);
  };

  const handleFormSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (markdownFileName.trim() === '') {
      setMarkdownFileNameError('Markdown file name cannot be empty');
      return;
    } else if (markdownFileName.trim().length > 50) {
      setMarkdownFileNameError(
        'Markdown file name cannot be greater than 50 characters'
      );
      return;
    }
    onSubmit(markdownFileName);
  };

  return (
    <form noValidate onSubmit={handleFormSubmit}>
      <TextInput
        required
        label='Markdown file name'
        placeholder='Enter markdown file name'
        value={markdownFileName}
        onChange={handleMarkdownFileNameChange}
        error={markdownFileNameError}
        variant='filled'
        className='mb-5'
      />

      <div className='flex gap-3 max-w-max ml-auto'>
        <Button type='submit' color='dark' size='xs'>
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

export default DownloadMarkdownForm;
