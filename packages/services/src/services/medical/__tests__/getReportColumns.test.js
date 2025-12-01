import { axios } from '@kitman/common/src/utils/services';

import { data as mockColumns } from '@kitman/services/src/mocks/handlers/medical/getReportColumns';
import getReportColumns, {
  GET_REPORT_COLUMNS_ENDPOINT,
} from '@kitman/services/src/services/medical/getReportColumns';

const reportType = 'injury_detail';

describe('getReportColumns', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getReportColumns(reportType);

    expect(returnedData).toEqual(mockColumns);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'get');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await getReportColumns(reportType);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(GET_REPORT_COLUMNS_ENDPOINT, {
        params: { report_type: 'injury_detail' },
      });
    });
  });
});
