// @flow
import { type DeleteImport } from '@kitman/common/src/utils/TrackingData/src/types/forms';
import { type ImportStatus } from '@kitman/common/src/types/Imports';

const getDeleteImportData = (submissionStatus: ImportStatus): DeleteImport => ({
  SubmissionStatus: submissionStatus,
});

export default getDeleteImportData;
