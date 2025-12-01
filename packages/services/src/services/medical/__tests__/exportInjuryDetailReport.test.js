import { axios } from '@kitman/common/src/utils/services';
import { mockedExportResponse } from '@kitman/services/src/mocks/handlers/medical/exportInjuryDetailReport';
import exportInjuryDetailReport from '../exportInjuryDetailReport';

describe('exportInjuryDetailReport', () => {
  let request;
  const issueTypes = ['Injury'];
  const population = {
    applies_to_squad: false,
    all_squads: false,
    position_groups: [],
    positions: [],
    athletes: [1, 2],
    squads: [],
    context_squads: [],
  };
  const columns = ['player_id', 'player_name', 'player_status'];
  const filters = {
    resolved: false,
    include_created_by_prior_club: true,
    date_ranges: [
      {
        start_time: '2022-10-26T22:59:59Z',
        end_time: '2022-10-30T23:00:00Z',
      },
    ],
    coding: {
      clinical_impressions: { codes: [1, 2], body_area_ids: [3, 4] },
    },
  };

  // MSW handler test
  it('returns the correct value', async () => {
    const returnedData = await exportInjuryDetailReport(
      issueTypes,
      population,
      columns,
      filters,
      false,
      'csv'
    );

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
      await exportInjuryDetailReport(
        issueTypes,
        population,
        columns,
        filters,
        false,
        'csv'
      );

      const bodyData = {
        issue_types: issueTypes,
        population,
        columns,
        filters,
        include_past_players: false,
        format: 'csv',
      };
      expect(request).toHaveBeenCalledWith(
        '/export_jobs/injury_detail_export',
        bodyData,
        { timeout: 0 }
      );
    });
  });
});
