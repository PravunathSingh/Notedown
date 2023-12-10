import React from 'react';
import MarkdownEditor from '@/components/editor/MarkdownEditor';
import PreviewPanel from '@/components/editor/PreviewPanel';
import { useEditorStore } from '@/store/editorStore';
import { useDisclosure } from '@mantine/hooks';
import { Modal } from '@mantine/core';
import DownloadMarkdownForm from '@/components/forms/DownloadMarkdownForm';
import DownloadPdfForm from '@/components/forms/DownloadPdfForm';
import { parseMarkdown } from '@/utils/parseMarkdown';
import { useDownloadPdf } from '@/apis/queries/downloadPdf.query';
import getBaseUrl from '@/utils/getBaseUrl';

const HomePage = () => {
  const { isPreviewPanelOpen } = useEditorStore();
  const { markdownValue } = useEditorStore();
  const [
    markdownDownloadModalOpen,
    { open: openMarkdownDownloadModal, close: closeMarkdownDownloadModal },
  ] = useDisclosure();
  const [
    parsedDocModalOpen,
    { open: openParsedDocModal, close: closeParsedDocModal },
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

  const download = useDownloadPdf();

  const downloadAsPdf = async (pdfFilename: string) => {
    download.mutate(
      {
        fileName: pdfFilename,
        doc: parseMarkdown(markdownValue),
      },
      {
        onSuccess: (data) => {
          // the download link is like this: http://localhost:3000/1627667440.pdf
          // so we just need to get the last part
          const fileName = data.fileName;
          const element = document.createElement('a');
          //  element.href is sitUrl/fileName

          element.href = `${getBaseUrl('')}${fileName}`;
          element.download = `${pdfFilename}.pdf`;
          document.body.appendChild(element);
          element.click();

          closeParsedDocModal();
        },
      }
    );
  };

  return (
    <div className='container h-[80vh] my-10 flex gap-5 items-center'>
      <MarkdownEditor onOpenMarkdownDownloadModal={openMarkdownDownloadModal} />
      {isPreviewPanelOpen && (
        <PreviewPanel onOpenParsedDocModal={openParsedDocModal} />
      )}

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

      <Modal
        opened={parsedDocModalOpen}
        onClose={closeParsedDocModal}
        title='Download PDF'
      >
        <DownloadPdfForm
          isLoading={download.isPending}
          onClose={closeParsedDocModal}
          onSubmit={downloadAsPdf}
        />
      </Modal>
    </div>
  );
};

export default HomePage;
