import { axios } from '@kitman/common/src/utils/services';
import { mockedExportResponse } from '@kitman/services/src/mocks/handlers/exports/exportTimeLossBodyPartReport';

import exportTimeLossBodyPartReport from '../exportTimeLossBodyPartReport';

describe('exportTimeLossBodyPartReport', () => {
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
  const columns = ['issue_date', 'athlete_id', 'player_name', 'issue_name'];
  const filters = {
    include_created_by_prior_club: true,
    date_ranges: {
      start_time: '2022-10-26T22:59:59Z',
      end_time: '2022-10-30T23:00:00Z',
    },
  };
  const format = 'csv';

  it('returns the correct csv value', async () => {
    const returnedData = await exportTimeLossBodyPartReport({
      issueTypes,
      population,
      columns,
      filters,
      format,
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
    it('calls the correct endpoint with correct body data in the request for csv', async () => {
      await exportTimeLossBodyPartReport({
        issueTypes,
        population,
        columns,
        filters,
        format,
        includePastPlayers: true, // Include past players: yes
      });

      const bodyData = {
        issue_types: issueTypes,
        population,
        columns,
        filters,
        format,
        include_past_players: true,
      };
      expect(request).toHaveBeenCalledWith(
        '/export_jobs/time_loss_body_part_export',
        bodyData,
        { timeout: 0 }
      );
    });
  });
});
