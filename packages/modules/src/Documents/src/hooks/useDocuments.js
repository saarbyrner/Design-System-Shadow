// @flow
import { useState, useEffect } from 'react';
import uuid from 'uuid';
import getDocuments from '@kitman/services/src/services/documents/getDocuments';
import uploadDocument from '@kitman/services/src/services/documents/uploadDocument';
import deleteDocument from '@kitman/services/src/services/documents/deleteDocument';
import type { RequestStatus } from '@kitman/common/src/types';
import { useToasts } from '@kitman/components/src/Toast/KitmanDesignSystem';
import type { ToastId } from '@kitman/components/src/Toast/types';
import {
  getFormattedDocument,
  getFormattedDocuments,
  getFeedbackMessage,
} from '../utils';
import type { FormattedDocument } from '../types';

const useDocuments = () => {
  const [initialRequestStatus, setInitialRequestStatus] =
    useState<RequestStatus>('PENDING');
  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);
  const [allowedExtensions, setAllowedExtensions] = useState<string[]>([]);
  const [documents, setDocuments] = useState<FormattedDocument[]>([]);
  const [deletableDocumentId, setDeletableDocumentId] = useState<number | null>(
    null
  );

  const { toasts, toastDispatch } = useToasts();

  useEffect(() => {
    getDocuments().then(
      (fetchedDocuments) => {
        setInitialRequestStatus('SUCCESS');
        setAllowedExtensions(fetchedDocuments.permitted_extensions);

        const buildFormattedDocuments = getFormattedDocuments(
          fetchedDocuments.documents
        );
        const formattedDocuments =
          buildFormattedDocuments(getFormattedDocument);
        setDocuments(formattedDocuments);
      },
      () => setInitialRequestStatus('FAILURE')
    );
  }, []);

  const onUploadDocument = (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const documentId = uuid.v4();

    const progressFeedbackMessage = getFeedbackMessage(
      'PROGRESS_UPLOAD',
      file.name
    );
    toastDispatch({
      type: 'CREATE_TOAST',
      toast: {
        id: documentId,
        title: progressFeedbackMessage,
        status: 'LOADING',
      },
    });

    uploadDocument(formData).then(
      (fetchedDocumentData) => {
        const successFeedbackMessage = getFeedbackMessage(
          'SUCCESS_UPLOAD',
          fetchedDocumentData.document.attachment.filename
        );
        toastDispatch({
          type: 'UPDATE_TOAST',
          toast: {
            id: documentId,
            title: successFeedbackMessage,
            status: 'SUCCESS',
          },
        });

        setDocuments((prevDocuments) => [
          getFormattedDocument(fetchedDocumentData.document),
          ...prevDocuments,
        ]);
      },
      () => {
        const errorFeedbackMessage = getFeedbackMessage('ERROR_UPLOAD');
        toastDispatch({
          type: 'UPDATE_TOAST',
          toast: {
            id: documentId,
            title: errorFeedbackMessage,
            status: 'SUCCESS',
          },
        });
      }
    );
  };

  const displayDeleteModal = (documentId: number) => {
    setDeletableDocumentId(documentId);
    setIsDeleteModalShown(true);
  };

  const getDeletableDocumentName = (): string =>
    documents.find((document) => document.id === deletableDocumentId)?.name ||
    '';

  const onDeleteDocument = () => {
    if (!deletableDocumentId) {
      return;
    }

    setIsDeleteModalShown(false);

    const progressFeedbackMessage = getFeedbackMessage(
      'PROGRESS_DELETE',
      getDeletableDocumentName()
    );
    toastDispatch({
      type: 'UPDATE_TOAST',
      toast: {
        id: deletableDocumentId,
        title: progressFeedbackMessage,
        status: 'LOADING',
      },
    });

    deleteDocument(deletableDocumentId).then(
      () => {
        const successFeedbackMessage = getFeedbackMessage(
          'SUCCESS_DELETE',
          getDeletableDocumentName()
        );
        toastDispatch({
          type: 'UPDATE_TOAST',
          toast: {
            id: deletableDocumentId,
            title: successFeedbackMessage,
            status: 'SUCCESS',
          },
        });

        setDocuments((prevDocuments) =>
          prevDocuments.filter(
            (document) => document.id !== deletableDocumentId
          )
        );
      },
      () => {
        const errorFeedbackMessage = getFeedbackMessage('ERROR_DELETE');
        toastDispatch({
          type: 'UPDATE_TOAST',
          toast: {
            id: deletableDocumentId,
            title: errorFeedbackMessage,
            status: 'ERROR',
          },
        });
      }
    );
  };

  const closeModal = () => {
    setDeletableDocumentId(null);
    setIsDeleteModalShown(false);
  };

  const closeToast = (id: ToastId) => {
    toastDispatch({
      type: 'REMOVE_TOAST_BY_ID',
      id,
    });
  };

  return {
    initialRequestStatus,
    allowedExtensions,
    documents,
    toasts,
    isDeleteModalShown,
    onUploadDocument,
    displayDeleteModal,
    getDeletableDocumentName,
    onDeleteDocument,
    closeModal,
    closeToast,
  };
};

export default useDocuments;
