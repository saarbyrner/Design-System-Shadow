import { axios } from '@kitman/common/src/utils/services';
import { mockedExportResponse } from '@kitman/services/src/mocks/handlers/exports/exportInjuryMedicationReport';
import exportInjuryMedicationReport from '../exportInjuryMedicationReport';

describe('exportInjuryMedicationReport', () => {
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
  const columns = ['player_name', 'issue_name', 'issue_date', 'medications'];
  const filters = {
    include_created_by_prior_club: true,
    date_ranges: [
      {
        start_time: '2022-10-26T22:59:59Z',
        end_time: '2022-10-30T23:00:00Z',
      },
    ],
  };

  it('returns the correct csv value', async () => {
    const returnedData = await exportInjuryMedicationReport(
      issueTypes,
      population,
      columns,
      filters,
      false,
      'csv'
    );
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
      await exportInjuryMedicationReport(
        issueTypes,
        population,
        columns,
        filters,
        false,
        'csv'
      );

      const bodyData = {
        format: 'csv',
        include_past_players: false,
        issue_types: issueTypes,
        population,
        columns,
        filters,
        name: 'Appendix BB Report',
      };
      expect(request).toHaveBeenCalledWith(
        '/export_jobs/injury_medication_export',
        bodyData,
        { timeout: 0 }
      );
    });

    it('calls the correct endpoint with correct body data in the request for json', async () => {
      await exportInjuryMedicationReport(
        issueTypes,
        population,
        columns,
        filters,
        false,
        'json'
      );

      const bodyData = {
        format: 'json',
        include_past_players: false,
        issue_types: issueTypes,
        population,
        columns,
        filters,
        name: 'Appendix BB Report',
      };
      expect(request).toHaveBeenCalledWith(
        '/export_jobs/injury_medication_export',
        bodyData,
        {
          timeout: 0,
        }
      );
    });

    it('calls the correct endpoint with correct body data in the request for xlsx', async () => {
      await exportInjuryMedicationReport(
        issueTypes,
        population,
        columns,
        filters,
        false,
        'xlsx'
      );

      const bodyData = {
        format: 'xlsx',
        include_past_players: false,
        issue_types: issueTypes,
        population,
        columns,
        filters,
        name: 'Appendix BB Report',
      };
      expect(request).toHaveBeenCalledWith(
        '/export_jobs/injury_medication_export',
        bodyData,
        {
          timeout: 0,
        }
      );
    });
  });
});
