import React from 'react';
import { parseMarkdown } from '@/utils/parseMarkdown';
import { useEditorStore } from '@/store/editorStore';
import {
  ActionIcon,
  CopyButton,
  Menu,
  Select,
  Tooltip,
  rem,
} from '@mantine/core';
import * as DOMPurify from 'isomorphic-dompurify';
import { IconCheck, IconCopy, IconDownload } from '@tabler/icons-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { addClassesToParsedHtml } from '@/utils/addClassesToParsedHtml';
import { convertTailwindClassesToCss } from '@/apiUtils/convertTailwindClassesToCss';

export interface PreviewPanelProps {
  onOpenParsedDocModal: () => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  onOpenParsedDocModal,
}) => {
  const { markdownValue } = useEditorStore();
  const [previewType, setPreviewType] = React.useState('rendered-html');

  const parsedHTML = parseMarkdown(markdownValue);

  return (
    <div className='w-1/2 h-full'>
      <div className='flex justify-between items-center w-full mb-1'>
        <div
          style={{
            accentColor: 'var(--mantine-color-accent)',
          }}
          className='flex items-center gap-4'
        >
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
        <div className='flex gap-3 items-center'>
          <ActionIcon
            disabled={parsedHTML.trim().length === 0}
            variant='subtle'
            color='gray'
            onClick={onOpenParsedDocModal}
          >
            <IconDownload style={{ width: rem(18) }} />
          </ActionIcon>
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
      </div>

      {previewType === 'rendered-html' ? (
        <div
          className='h-full leading-relaxed overflow-auto break-words bg-gray-100 border border-gray-300 rounded p-4'
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(addClassesToParsedHtml(parsedHTML)),
          }}
        ></div>
      ) : (
        <div className='h-full overflow-auto bg-gray-100 text-sm border border-gray-300 rounded p-4'>
          <SyntaxHighlighter language='html' showLineNumbers={true}>
            {addClassesToParsedHtml(parsedHTML)}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;
