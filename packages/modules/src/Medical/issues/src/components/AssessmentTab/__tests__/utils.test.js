import buildDataTableHeaderData from '@kitman/modules/src/Medical/issues/src/components/AssessmentTab/utils';
import {
  reactDataGridColumns as headerData,
  data as responseData,
} from '@kitman/modules/src/Medical/issues/src/components/AssessmentTab/ResultsTableDummyData';

describe('Concussion Tab utils', () => {
  test('buildDataTableHeaderData builds the correct table header data', () => {
    const headers = buildDataTableHeaderData(responseData);
    headers.forEach((header) => {
      // remove functions for stable compare
      // eslint-disable-next-line no-param-reassign
      delete header.formatter;
    });
    expect(headers).toEqual(headerData);
  });
});
