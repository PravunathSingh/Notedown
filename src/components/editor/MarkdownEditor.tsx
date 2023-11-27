import React from 'react';
import {
  CopyButton,
  Tooltip,
  ActionIcon,
  rem,
  Menu,
  TextInput,
} from '@mantine/core';
import {
  IconCopy,
  IconCheck,
  IconEye,
  IconSearch,
  IconReplace,
  IconDownload,
} from '@tabler/icons-react';
import { useEditorStore } from '@/store/editorStore';
import { IconEyeOff } from '@tabler/icons-react';
import { shallow } from 'zustand/shallow';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import EmojiDropdown from './EmojiDropdown';

export interface MarkdownEditorProps {
  onOpenMarkdownDownloadModal: () => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  onOpenMarkdownDownloadModal,
}) => {
  const [markdown, setMarkdown] = React.useState('');
  const [searchedText, setSearchedText] = React.useState('');
  const [replacedText, setReplacedText] = React.useState('');
  const [occurrences, setOccurrences] = React.useState(0);

  const { isPreviewPanelOpen, updateMarkdownValue, togglePreviewPanel } =
    useEditorStore(
      (state) => ({
        isPreviewPanelOpen: state.isPreviewPanelOpen,
        updateMarkdownValue: state.updateMarkdownValue,
        togglePreviewPanel: state.togglePreviewPanel,
      }),
      shallow
    );

  const updateEditorValue = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
    updateMarkdownValue(event.target.value);
  };

  // get occurrences of searched text in markdown if and only if searched text is not empty
  React.useEffect(() => {
    if (searchedText === '') {
      setOccurrences(0);
      return;
    }
    const regex = new RegExp(searchedText, 'g');
    const matches = markdown.match(regex);
    if (matches) {
      setOccurrences(matches.length);
    } else {
      setOccurrences(0);
    }
  }, [searchedText]);

  const replaceAll = () => {
    const regex = new RegExp(searchedText, 'g');
    const replacedMarkdown = markdown.replace(regex, replacedText);
    setMarkdown(replacedMarkdown);
    updateMarkdownValue(replacedMarkdown);

    setSearchedText('');
    setReplacedText('');
  };

  return (
    <motion.div
      initial={false}
      animate={{ width: isPreviewPanelOpen ? '50%' : '100%' }}
      className={classNames(
        'max-w-full h-full my-20',
        isPreviewPanelOpen ? 'w-1/2' : 'w-full'
      )}
    >
      <div className='flex justify-between w-full mb-1'>
        <span className='text-lg font-semibold'>Markdown</span>
        <div className='flex items-center gap-4'>
          <ActionIcon
            disabled={!markdown.trim().length}
            variant='subtle'
            color='gray'
            onClick={onOpenMarkdownDownloadModal}
          >
            <IconDownload style={{ width: rem(18) }} />
          </ActionIcon>
          <EmojiDropdown
            onSelectEmoji={(emoji) => {
              if (!markdown.trim().length) {
                setMarkdown(`:${emoji.name}: ${markdown}`);
                updateMarkdownValue(`:${emoji.name}: ${markdown}`);
              } else {
                setMarkdown(`${markdown} :${emoji.name}: `);
                updateMarkdownValue(`${markdown} :${emoji.name}: `);
              }
            }}
          />
          <Menu
            shadow='md'
            position='left-start'
            width='auto'
            closeOnItemClick={false}
            onClose={() => {
              setSearchedText('');
              setReplacedText('');
            }}
          >
            <Menu.Target>
              <Tooltip position='right' label='Search & Replace'>
                <ActionIcon variant='subtle' color='gray'>
                  <IconSearch style={{ width: rem(18) }} />
                </ActionIcon>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <div className='flex items-center justify-between'>
                  <div>
                    <span className='text-sm'>No of occurrences: </span>
                    <span className='font-semibold text-sm'>{occurrences}</span>
                  </div>
                  <ActionIcon
                    disabled={occurrences === 0}
                    variant='subtle'
                    color='gray'
                    onClick={replaceAll}
                  >
                    <IconReplace style={{ width: rem(16) }} />
                  </ActionIcon>
                </div>
              </Menu.Item>
              <Menu.Item>
                <TextInput
                  placeholder='Search...'
                  leftSection={<IconSearch style={{ width: rem(14) }} />}
                  size='xs'
                  value={searchedText}
                  onChange={(event) => {
                    setSearchedText(event.currentTarget.value);
                  }}
                />
              </Menu.Item>
              <Menu.Item>
                <TextInput
                  placeholder='Replace...'
                  leftSection={<IconReplace style={{ width: rem(14) }} />}
                  size='xs'
                  value={replacedText}
                  onChange={(event) => {
                    setReplacedText(event.currentTarget.value);
                  }}
                />
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <CopyButton value={markdown} timeout={2000}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? 'Copied' : 'Copy'}
                withArrow
                position='left'
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
          <Tooltip label='Toggle Preview Panel' withArrow position='right'>
            <ActionIcon
              variant='subtle'
              color='gray'
              onClick={togglePreviewPanel}
            >
              {isPreviewPanelOpen ? (
                <IconEye style={{ width: rem(18) }} />
              ) : (
                <IconEyeOff style={{ width: rem(18) }} />
              )}
            </ActionIcon>
          </Tooltip>
        </div>
      </div>

      <textarea
        onChange={updateEditorValue}
        value={markdown}
        placeholder='Start typing...'
        className='border font-mono border-gray-300 w-full h-[80vh] focus:outline focus:outline-indigo-500 rounded p-4 font-medium'
      ></textarea>
    </motion.div>
  );
};

export default MarkdownEditor;
