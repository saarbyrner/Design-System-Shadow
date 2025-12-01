import { axios } from '@kitman/common/src/utils/services';
import exportCombinedAnkleSupport from '../medical/exportCombinedAnkleSupport';

describe('exportCombinedAnkleSupport', () => {
  let request;
  const exportQuery = {
    key: 'nba-ankle-em-2324-v2',
    startDate: undefined,
    endDate: undefined,
  };

  // MSW handler test
  it('returns the correct value', async () => {
    const returnedData = await exportCombinedAnkleSupport(exportQuery);
    const expectedResult = {
      csvData: 'Testing,One,Two,Three',
      contentDisposition: 'attachment; filename="testFilename.csv"',
    };
    expect(returnedData).toEqual(expectedResult);
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with correct body data in the request', async () => {
      await exportCombinedAnkleSupport(exportQuery);

      const bodyData = {
        key: 'nba-ankle-em-2324-v2',
        start_date: undefined,
        end_date: undefined,
      };
      expect(request).toHaveBeenCalledWith(
        '/ui/concussion/form_answers_sets/export_nba_combined_ankle_forms',
        bodyData,
        { timeout: 0 }
      );
    });
  });
});
