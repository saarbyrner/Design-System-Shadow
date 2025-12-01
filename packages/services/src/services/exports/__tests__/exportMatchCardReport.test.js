import { axios } from '@kitman/common/src/utils/services';
import exportMatchReport from '../exportMatchReport';

describe('exportMatchReport', () => {
  beforeAll(() => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: {} });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should export match report', async () => {
    const filter = {
      competitions: [],
      organisations: [],
      squad_names: [],
      statuses: [],
      dateRange: [],
      search_expression: '',
    };

    await exportMatchReport(filter);
    expect(axios.post).toHaveBeenCalledWith(
      '/export_jobs/match_report_export',
      {
        filter: {
          competitions: [],
          organisations: [],
          squad_names: [],
          statuses: [],
          date_range: [],
          search_expression: '',
        },
      }
    );
  });
});
