import { axios } from '@kitman/common/src/utils/services';
import { mockedExportResponse } from '@kitman/services/src/mocks/handlers/exports/exportMedicationsReport';
import exportMedicationsReport from '@kitman/services/src/services/medical/exports/exportMedicationsReport';

describe('exportMedicationsReport', () => {
  let request;
  const population = {
    applies_to_squad: false,
    all_squads: false,
    position_groups: [],
    positions: [],
    athletes: [1, 2],
    squads: [],
    context_squads: [],
  };
  const columns = [
    'player_name',
    'reason',
    'medication',
    'start_date',
    'end_date',
  ];
  const filters = {
    report_range: {
      start_date: '2022-10-26T22:59:59Z',
      end_date: '2022-10-30T23:00:00Z',
    },
    include_all_active: true,
    archived: false,
  };

  it('returns the correct csv value', async () => {
    const returnedData = await exportMedicationsReport({
      population,
      columns,
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

    it('calls the correct endpoint with correct body data in the request for pdf', async () => {
      await exportMedicationsReport({
        population,
        columns,
        filters,
        format: 'pdf',
      });

      const bodyData = {
        population,
        columns,
        filters,
        format: 'pdf',
      };

      expect(request).toHaveBeenCalledWith(
        '/export_jobs/medications_report_export',
        bodyData,
        {
          timeout: 0,
        }
      );
    });

    it('calls the correct endpoint with correct body data in the request for csv', async () => {
      await exportMedicationsReport({
        population,
        columns,
        filters,
        format: 'csv',
      });

      const bodyData = {
        population,
        columns,
        filters,
        format: 'csv',
      };

      expect(request).toHaveBeenCalledWith(
        '/export_jobs/medications_report_export',
        bodyData,
        { timeout: 0 }
      );
    });
  });
});
