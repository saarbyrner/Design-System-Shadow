// @flow
import { type ImportStatus } from '@kitman/common/src/types/Imports';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';
import {
  SubmissionStatusChipBackgroundColors,
  SubmissionStatusChipIconFills,
} from '../utils/consts';

export type SubmissionsRow = {
  id: number,
  submissionDate: string,
  submittedBy: string,
  submissionStatus: ImportStatus,
  exportSuccessCsv: ?string,
  exportErrorCsv: ?string,
};

export type SubmissionStatusChipBackgroundColor = $Values<
  typeof SubmissionStatusChipBackgroundColors
>;

export type SubmissionStatusChipIconFill = $Values<
  typeof SubmissionStatusChipIconFills
>;

export type ImportTypesWithSubmissionsTable = $Values<typeof IMPORT_TYPES>;
