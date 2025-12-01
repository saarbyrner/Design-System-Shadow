import { axios } from '@kitman/common/src/utils/services';
import { mockedExportResponse } from '@kitman/services/src/mocks/handlers/exports/exportInjurySurveillanceReport';
import exportInjurySurveillanceReport from '../exportInjurySurveillanceReport';

describe('exportInjurySurveillanceReport', () => {
  let request;
  const population = [
    {
      squads: [],
    },
  ];
  const filters = {
    date_ranges: [
      {
        start_time: '2022-10-26T22:59:59Z',
        end_time: '2022-10-30T23:00:00Z',
      },
    ],
  };
  const screeningRulesetIds = [1, 2, 3];

  it('returns the correct value', async () => {
    const returnedData = await exportInjurySurveillanceReport({
      name: 'Logic Builder - Medical Report',
      squads: [],
      dateRange: filters.date_ranges,
      anonymiseReport: false,
      screeningRulesetIds,
      format: 'csv',
      includePastPlayers: false,
    });

    expect(returnedData).toEqual(mockedExportResponse);
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with correct body data in the request', async () => {
      await exportInjurySurveillanceReport({
        name: 'Logic Builder - Medical Report',
        squads: [],
        dateRange: filters.date_ranges,
        anonymiseReport: false,
        screeningRulesetIds,
        format: 'csv',
        includePastPlayers: false,
      });

      const bodyData = {
        name: 'Logic Builder - Medical Report',
        population,
        filters,
        anonymise_report: false,
        screening_ruleset_ids: [1, 2, 3],
        format: 'csv',
        include_past_players: false,
      };
      expect(request).toHaveBeenCalledWith(
        '/export_jobs/injury_surveillance_export',
        bodyData,
        { timeout: 0 }
      );
    });

    it('includes include_past_players when set to true', async () => {
      await exportInjurySurveillanceReport({
        name: 'Logic Builder - Medical Report',
        squads: [],
        dateRange: filters.date_ranges,
        anonymiseReport: false,
        screeningRulesetIds,
        format: 'csv',
        includePastPlayers: true,
      });

      const bodyData = {
        name: 'Logic Builder - Medical Report',
        population,
        filters,
        anonymise_report: false,
        screening_ruleset_ids: [1, 2, 3],
        format: 'csv',
        include_past_players: true,
      };
      expect(request).toHaveBeenCalledWith(
        '/export_jobs/injury_surveillance_export',
        bodyData,
        { timeout: 0 }
      );
    });
  });
});
