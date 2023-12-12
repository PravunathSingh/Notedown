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
import { useSharePreview } from '@/apis/queries/sharePreview.query';
import PreviewModal from '@/components/editor/PreviewModal';
import { addClassesToParsedHtml } from '@/utils/addClassesToParsedHtml';

const HomePage = () => {
  const [previewLink, setPreviewLink] = React.useState<string | null>(null);
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
  const [
    previewModalOpen,
    { open: openPreviewModal, close: closePreviewModal },
  ] = useDisclosure();

  const sharePreview = useSharePreview();

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
        doc: addClassesToParsedHtml(parseMarkdown(markdownValue)),
      },
      {
        onSuccess: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.download = `${pdfFilename}.pdf`;
          a.href = url;
          a.click();
          setTimeout(function () {
            // For Firefox it is necessary to delay revoking the ObjectURL
            a.remove();
            URL.revokeObjectURL(url);
          }, 100);

          closeParsedDocModal();
        },
      }
    );
  };

  const sharePreviewHandler = ({
    type,
    doc,
  }: {
    type: 'md' | 'parsed';
    doc: string;
  }) => {
    sharePreview.mutate(
      {
        type,
        doc,
      },
      {
        onSuccess: (data) => {
          setPreviewLink(`${getBaseUrl('')}preview?fileName=${data.fileName}`);
          openPreviewModal();
        },
      }
    );
  };

  return (
    <div className='container h-[80vh] my-10 flex flex-wrap gap-5 items-center'>
      <MarkdownEditor
        isGeneratingPreview={sharePreview.isPending}
        onShareMarkdownPreview={sharePreviewHandler}
        onOpenMarkdownDownloadModal={openMarkdownDownloadModal}
      />
      {isPreviewPanelOpen && (
        <PreviewPanel
          onShareHTMLPreview={sharePreviewHandler}
          isGeneratingPreview={sharePreview.isPending}
          onOpenParsedDocModal={openParsedDocModal}
        />
      )}

      <Modal
        styles={{
          title: {
            fontSize: '1.185rem',
            fontWeight: 600,
          },
        }}
        centered
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
        styles={{
          title: {
            fontSize: '1.185rem',
            fontWeight: 600,
          },
        }}
        centered
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

      <Modal
        size='md'
        opened={previewModalOpen}
        onClose={closePreviewModal}
        title='Preview Link'
        centered
        styles={{
          title: {
            fontSize: '1.185rem',
            fontWeight: 600,
          },
        }}
      >
        <PreviewModal previewLink={previewLink} />
      </Modal>
    </div>
  );
};

export default HomePage;
