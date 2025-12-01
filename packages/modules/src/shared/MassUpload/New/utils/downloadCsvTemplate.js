// @flow
import downloadCSV from '@kitman/common/src/utils/downloadCSV';
import { IMPORT_TYPES } from './consts';
import getExpectedHeaders from './getExpectedHeaders';

const downloadCsvTemplate = (
  label: string,
  importType: $Values<typeof IMPORT_TYPES>
) => {
  downloadCSV(label, [], { fields: getExpectedHeaders(importType) });
};

export default downloadCsvTemplate;
