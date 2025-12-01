// @flow
import type { Document } from '@kitman/common/src/types/Document';

export type CreatedDocument = {
  document: Document,
};

export type FormattedDocument = {
  id: number,
  name: string,
  modifiedDate: string,
  owner?: string,
  size: number,
  url: string,
  downloadUrl: string,
};

export type FormattedDocuments = Array<FormattedDocument>;

export type FormatFn = (document: Document) => FormattedDocument;

export type FeedbackType =
  | 'PROGRESS_UPLOAD'
  | 'SUCCESS_UPLOAD'
  | 'ERROR_UPLOAD'
  | 'PROGRESS_DELETE'
  | 'SUCCESS_DELETE'
  | 'ERROR_DELETE';
