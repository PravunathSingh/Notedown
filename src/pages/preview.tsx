import { useGetPreview } from '@/apis/queries/sharePreview.query';
import { Card, Loader, ScrollArea } from '@mantine/core';
import DOMPurify from 'dompurify';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';

const PreviewPage = () => {
  const router = useRouter();

  const { fileName } = router.query;

  const previewData = useGetPreview(fileName as string);

  return (
    <div className='bg-gray-100 flex items-center justify-center'>
      {!fileName ? (
        <div className='max-w-xl h-screen flex justify-center items-center mx-auto'>
          <div className='leading-snug text-center text-3xl font-semibold mx-auto'>
            <p>No preview available. Query param is missing.</p>

            <Link
              href='/'
              className='text-lg text-blue-500 hover:underline underline-offset-2'
            >
              Go back to home
            </Link>
          </div>
        </div>
      ) : previewData.isLoading ? (
        <div className='max-w-lg h-screen flex justify-center items-center mx-auto'>
          <div className='flex flex-col gap-4 justify-center items-center'>
            <Loader size={48} />

            <p className='text-center text-lg font-semibold'>
              Loading preview...
            </p>
          </div>
        </div>
      ) : previewData.isError ? (
        <div className='max-w-xl h-screen flex justify-center items-center mx-auto'>
          <div className='leading-snug text-center text-3xl font-semibold mx-auto'>
            <p>No preview available. The link is expired.</p>

            <Link
              href='/'
              className='text-lg text-blue-500 hover:underline underline-offset-2'
            >
              Go back to home
            </Link>
          </div>
        </div>
      ) : previewData?.data && fileName.includes('md') ? (
        <div className='h-screen flex-grow max-w-6xl'>
          <h2 className='my-10'>Preview</h2>
          <Card shadow='sm' radius='lg' className='mb-20 mx-auto h-3/4'>
            <SyntaxHighlighter
              language='markdown'
              customStyle={{
                padding: '1rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                lineHeight: '1.5rem',
                wordWrap: 'break-word',
                overflow: 'auto',
              }}
            >
              {previewData?.data?.fileContent}
            </SyntaxHighlighter>
          </Card>
        </div>
      ) : (
        <div className='h-screen flex-grow max-w-6xl'>
          <h2 className='my-10'>Preview</h2>

          <Card
            shadow='sm'
            padding='lg'
            radius='lg'
            className='mb-20 mx-auto h-3/4'
          >
            <ScrollArea
              offsetScrollbars
              scrollbarSize={6}
              className='prose w-full break-words overflow-auto'
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(previewData?.data?.fileContent),
                }}
              />
            </ScrollArea>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PreviewPage;
