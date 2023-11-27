import React from 'react';
import { parseMarkdown } from '@/utils/parseMarkdown';
import { useEditorStore } from '@/store/editorStore';
import { ActionIcon, CopyButton, Select, Tooltip, rem } from '@mantine/core';
import * as DOMPurify from 'isomorphic-dompurify';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import SyntaxHighlighter from 'react-syntax-highlighter';

const PreviewPanel = () => {
  const { markdownValue } = useEditorStore();
  const [previewType, setPreviewType] = React.useState('rendered-html');

  const parsedHTML = parseMarkdown(markdownValue);

  return (
    <div className='w-1/2 h-full'>
      <div className='flex justify-between w-full mb-1'>
        <div className='flex items-center gap-4'>
          <span className='text-lg font-semibold'>Preview</span>
          <Select
            allowDeselect={false}
            size='xs'
            value={previewType}
            data={[
              { value: 'source-html', label: 'Source HTML' },
              { value: 'rendered-html', label: 'Rendered HTML' },
            ]}
            onChange={(value) => {
              setPreviewType(value as string);
            }}
          />
        </div>
        {previewType === 'source-html' ? (
          <CopyButton value={parsedHTML} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? 'Copied' : 'Copy'}
                withArrow
                position='right'
              >
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
              </Tooltip>
            )}
          </CopyButton>
        ) : null}
      </div>

      {previewType === 'rendered-html' ? (
        <div
          className='h-full leading-relaxed overflow-auto break-words bg-gray-100 border border-gray-300 rounded p-4'
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(parsedHTML),
          }}
        ></div>
      ) : (
        <div className='h-full overflow-auto bg-gray-100 text-sm border border-gray-300 rounded p-4'>
          <SyntaxHighlighter language='html' showLineNumbers={true}>
            {parsedHTML}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
