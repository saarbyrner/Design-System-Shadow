import { axios } from '@kitman/common/src/utils/services';
import { mockedExportResponse } from '@kitman/services/src/mocks/handlers/exports/exportOsha300Report';
import exportOsha300Report from '@kitman/services/src/services/medical/exports/exportOsha300Report';

let request;

const filters = {
  date_range: {
    start_time: '2022-10-26T00:00:00Z',
    end_time: '2022-10-30T23:59:59Z',
  },
  include_created_by_prior_club: false,
};

describe('exportOsha300Report', () => {
  it('returns the correct csv value', async () => {
    const returnedData = await exportOsha300Report({
      filters,
      format: 'csv',
    });

    // All formats will return the same response type
    expect(returnedData).toEqual(mockedExportResponse);
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request for csv', async () => {
      await exportOsha300Report({
        filters,
        format: 'csv',
      });

      const bodyData = {
        filters,
        format: 'csv',
      };

      expect(request).toHaveBeenCalledWith(
        '/export_jobs/osha_report_export',
        bodyData,
        { timeout: 0 }
      );
    });

    it('calls the correct endpoint with correct body data in the request for xlsx', async () => {
      await exportOsha300Report({
        filters,
        format: 'xlsx',
      });

      const bodyData = {
        filters,
        format: 'xlsx',
      };

      expect(request).toHaveBeenCalledWith(
        '/export_jobs/osha_report_export',
        bodyData,
        { timeout: 0 }
      );
    });

    it('calls the correct endpoint with correct body data in the request for pdf', async () => {
      await exportOsha300Report({
        filters,
        format: 'pdf',
      });

      const bodyData = {
        filters,
        format: 'pdf',
      };

      expect(request).toHaveBeenCalledWith(
        '/export_jobs/osha_report_export',
        bodyData,
        {
          timeout: 0,
        }
      );
    });
  });
});
