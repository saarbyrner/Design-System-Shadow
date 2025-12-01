import { axios } from '@kitman/common/src/utils/services';
import exportMatchMonitorReport from '../exportMatchMonitorReport';

describe('exportMatchMonitorReport', () => {
  beforeAll(() => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: {} });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should export match monitor report', async () => {
    const filter = {
      competitions: [],
      organisations: [],
      squad_names: [],
      statuses: [],
      dateRange: [],
      search_expression: '',
    };

    await exportMatchMonitorReport(filter);
    expect(axios.post).toHaveBeenCalledWith(
      '/export_jobs/match_monitor_report_export',
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
