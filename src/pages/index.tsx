import React from 'react';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import PreviewPanel from '@/components/editor/PreviewPanel';
import { useEditorStore } from '@/store/editorStore';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import DownloadMarkdownForm from '@/components/forms/DownloadMarkdownForm';

const HomePage = () => {
  const { isPreviewPanelOpen } = useEditorStore();
  const { markdownValue } = useEditorStore();
  const [
    markdownDownloadModalOpen,
    { open: openMarkdownDownloadModal, close: closeMarkdownDownloadModal },
  ] = useDisclosure();

  const downloadAsMarkdown = (markdownFilename: string) => {
    const element = document.createElement('a');
    const file = new Blob([markdownValue], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${markdownFilename}.md`;
    document.body.appendChild(element);
    element.click();
    closeMarkdownDownloadModal();
  };

  return (
    <div className='container h-[80vh] my-10 flex gap-5 items-center'>
      <MarkdownEditor onOpenMarkdownDownloadModal={openMarkdownDownloadModal} />
      {isPreviewPanelOpen && <PreviewPanel />}

      <Modal
        opened={markdownDownloadModalOpen}
        onClose={closeMarkdownDownloadModal}
        title='Download Markdown'
      >
        <DownloadMarkdownForm
          onClose={closeMarkdownDownloadModal}
          onSubmit={downloadAsMarkdown}
        />
      </Modal>
    </div>
  );
};

export default HomePage;
