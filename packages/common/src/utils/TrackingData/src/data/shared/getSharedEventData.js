// @flow
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

const getMassUploadImportType = (
  importType: $Values<typeof IMPORT_TYPES>
): { 'Import Type': $Values<typeof IMPORT_TYPES> } => ({
  'Import Type': importType,
});

const getMassUploadParseCSVData = ({
  importType,
  columnCount,
  rowCount,
  vendor,
}: {
  importType: $Values<typeof IMPORT_TYPES>,
  columnCount: number,
  rowCount: number,
  vendor?: string | null,
}): {
  'Import Type': $Values<typeof IMPORT_TYPES>,
  'Column Count': number,
  'Row Count': number,
  Vendor: string | null,
} => ({
  'Import Type': importType ?? null,
  'Column Count': columnCount,
  'Row Count': rowCount,
  Vendor: vendor ?? null,
});

export { getMassUploadImportType, getMassUploadParseCSVData };
