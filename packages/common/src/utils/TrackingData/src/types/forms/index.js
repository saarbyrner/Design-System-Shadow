// @flow
import { type ImportStatus } from '@kitman/common/src/types/Imports';

export type FormData = $Exact<{
  formId: number,
  name: string,
  type: string,
  category: string,
  editorId: number,
  athleteId?: number,
}>;

export type DeleteImport = $Exact<{
  SubmissionStatus: ImportStatus,
}>;
