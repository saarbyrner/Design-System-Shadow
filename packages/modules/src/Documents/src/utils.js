// @flow
import moment from 'moment-timezone';
import i18n from '@kitman/common/src/utils/i18n';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import type { Document } from '@kitman/common/src/types/Document';
import type { FormatFn, FormattedDocument, FeedbackType } from './types';

export const getFeedbackMessage = (
  feedbackType: FeedbackType,
  fileName?: string
): string => {
  switch (feedbackType) {
    case 'PROGRESS_UPLOAD':
      if (!fileName) return 'Uploading document';
      return i18n.t('Uploading {{fileName}}', {
        fileName,
      });
    case 'SUCCESS_UPLOAD':
      if (!fileName) return 'document uploaded successfully';
      return i18n.t('{{fileName}} uploaded successfully', {
        fileName,
      });
    case 'ERROR_UPLOAD':
      return i18n.t('Upload unsuccessful');
    case 'PROGRESS_DELETE':
      if (!fileName) return 'Deleting document';
      return i18n.t('Deleting {{fileName}}', {
        fileName,
      });
    case 'SUCCESS_DELETE':
      if (!fileName) return 'document deleted successfully';
      return i18n.t('{{fileName}} deleted successfully', {
        fileName,
      });
    case 'ERROR_DELETE':
      return i18n.t('Delete unsuccessful');
    default:
      return '';
  }
};

export const getFormattedDocument = (
  document: Document
): FormattedDocument => ({
  id: document.id,
  name: document.attachment.filename,
  modifiedDate: document.updated_at,
  owner: document.attachment.created_by?.fullname,
  size: document.attachment.filesize,
  url: document.attachment.url,
  downloadUrl: document.attachment.download_url,
});

export const getFormattedDocuments =
  (documents: Document[]) =>
  (fn: FormatFn): FormattedDocument[] =>
    documents.map((document) => fn(document));

export const localTimezone =
  document.getElementsByTagName('body')[0].dataset.timezone || 'UTC';

export const formatDate = (date: moment): string => {
  if (window.featureFlags['standard-date-formatting']) {
    return formatStandard({
      date,
      showTime: true,
    });
  }

  return date.format('DD MMM YYYY [at] h:mm a');
};

export const downloadDocument = (downloadUrl: string) =>
  window.location.assign(downloadUrl);
