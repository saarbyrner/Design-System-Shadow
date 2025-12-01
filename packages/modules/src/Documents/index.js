// @flow
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import {
  AppStatus,
  DelayedLoadingFeedback,
  ErrorBoundary,
} from '@kitman/components';
import { ToastDialog } from '@kitman/components/src/Toast/KitmanDesignSystem';
import useDocuments from './src/hooks/useDocuments';
import { DocumentsHeaderTranslated as DocumentsHeader } from './src/components/DocumentsHeader';
import { DocumentsTableTranslated as DocumentsTable } from './src/components/DocumentsTable';
import { DeleteDocumentModalTranslated as DeleteDocumentModal } from './src/components/DeleteDocumentModal';
import styles from './src/components/styles';

const DocumentsApp = () => {
  const {
    initialRequestStatus,
    allowedExtensions,
    documents,
    toasts,
    closeToast,
    isDeleteModalShown,
    onUploadDocument,
    displayDeleteModal,
    getDeletableDocumentName,
    onDeleteDocument,
    closeModal,
  } = useDocuments();

  switch (initialRequestStatus) {
    case 'FAILURE':
      return <AppStatus status="error" isEmbed />;
    case 'PENDING':
      return <DelayedLoadingFeedback />;
    case 'SUCCESS':
      return (
        <I18nextProvider i18n={i18n}>
          <ErrorBoundary>
            <section data-testid="Documents" css={styles.wrapper}>
              <DocumentsHeader
                allowedExtensions={allowedExtensions}
                onUploadDocument={onUploadDocument}
              />
              <DocumentsTable
                documents={documents}
                displayDeleteModal={displayDeleteModal}
              />
              <DeleteDocumentModal
                isDeleteModalShown={isDeleteModalShown}
                getDeletableDocumentName={getDeletableDocumentName}
                onDeleteDocument={onDeleteDocument}
                closeModal={closeModal}
              />
              <ToastDialog toasts={toasts} onCloseToast={closeToast} />
            </section>
          </ErrorBoundary>
        </I18nextProvider>
      );
    default:
      return null;
  }
};

export default DocumentsApp;
