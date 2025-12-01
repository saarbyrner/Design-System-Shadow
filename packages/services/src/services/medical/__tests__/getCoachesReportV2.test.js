import { AsyncJobReport } from '@kitman/services/src/mocks/handlers/medical/getCoachesReportV2';
import { axios } from '@kitman/common/src/utils/services';
import getCoachesReportV2 from '../getCoachesReportV2';

const MOCK_COLUMNS = [
  'athlete',
  'issue_name',
  'onset_date',
  'athlete_name',
  'availability_status',
  'open_injuries_names',
  'last_daily_status_content',
  'position',
  'athlete_squad_names',
  'unavailable_since',
];

const BASE_REQUEST = {
  name: 'Daily Status Report Export',
  reportDate: 'Jun 25, 2024',
  format: 'PDF',
  columns: MOCK_COLUMNS,
  grouping: null,
  squadIds: [2],
  onlyIncludeMostRecentInjury: false,
  excludePlayersWithNoNotes: false,
};

describe('getCoachesReportV2', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns an AsyncJobReport DS when PDF', async () => {
    const returnedData = await getCoachesReportV2(BASE_REQUEST);

    expect(returnedData).toEqual(AsyncJobReport);
  });

  it('returns an AsyncJobReport DS when CSV', async () => {
    const returnedData = await getCoachesReportV2({
      ...BASE_REQUEST,
      format: 'CSV',
    });

    expect(returnedData).toEqual(AsyncJobReport);
  });

  it('returns an AsyncJobReport DS when grouping changes', async () => {
    const returnedData = await getCoachesReportV2({
      ...BASE_REQUEST,
      grouping: 'position',
    });

    expect(returnedData).toEqual(AsyncJobReport);
  });

  describe('Mock axios', () => {
    let request;

    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });
    it('calls the correct endpoint with correct body data in the request', async () => {
      const bodyData = {
        name: 'Daily Status Report Export',
        report_date: 'Jun 25, 2024',
        format: 'PDF',
        filters: {
          columns: [
            'athlete',
            'issue_name',
            'onset_date',
            'athlete_name',
            'availability_status',
            'open_injuries_names',
            'last_daily_status_content',
            'position',
            'athlete_squad_names',
            'unavailable_since',
          ],
          grouping: null,
          squad_ids: [2],
          only_include_most_recent_injury: false,
          exclude_athletes_without_note: false,
        },
      };
      await getCoachesReportV2(BASE_REQUEST);

      expect(request).toHaveBeenCalledWith(
        '/export_jobs/daily_status_report_export',
        bodyData
      );
    });
  });
});
