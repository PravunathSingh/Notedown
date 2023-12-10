import { ActionIcon, CopyButton, rem } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import Link from 'next/link';
import React from 'react';

export interface PreviewModalProps {
  previewLink: string | null;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ previewLink }) => {
  return (
    <div className='space-y-2'>
      <p className=''>
        You can share this link with anyone to view the preview
      </p>
      <div className='flex items-center gap-2'>
        <Link
          target='_blank'
          href={previewLink as string}
          className='text-blue-700 hover:underline font-medium'
        >
          {previewLink}
        </Link>
        <CopyButton value={previewLink as string} timeout={2000}>
          {({ copied, copy }) => (
            <ActionIcon
              color={copied ? 'teal' : 'gray'}
              variant='subtle'
              onClick={copy}
            >
              {copied ? (
                <IconCheck style={{ width: rem(18) }} />
              ) : (
                <IconCopy style={{ width: rem(18) }} />
              )}
            </ActionIcon>
          )}
        </CopyButton>
      </div>
    </div>
  );
};

export default PreviewModal;
