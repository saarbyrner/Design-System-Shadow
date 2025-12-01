import $ from 'jquery';
import exportQualityReports from '../exportQualityReports';

describe('exportQualityReports', () => {
  let exportQualityReportsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    exportQualityReportsRequest = jest.spyOn($, 'ajax').mockImplementation(() =>
      deferred.resolve({
        attachments: [],
        created_at: '2022-09-02T17:10:26+01:00',
        export_type: 'quality_reports',
        id: 24,
        name: 'Exposure Quality Check',
        status: 'pending',
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await exportQualityReports({
      dateRange: {
        end_date: '2022-09-30T22:59:59Z',
        start_date: '2022-08-03T23:00:00Z',
      },
      name: 'Mock file name',
      squadIds: [8],
    });
    expect(returnedData).toEqual({
      attachments: [],
      created_at: '2022-09-02T17:10:26+01:00',
      export_type: 'quality_reports',
      id: 24,
      name: 'Exposure Quality Check',
      status: 'pending',
    });

    expect(exportQualityReportsRequest).toHaveBeenCalledTimes(1);
    expect(exportQualityReportsRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/exposure_quality_check',
      data: {
        date_range: {
          end_date: '2022-09-30T22:59:59Z',
          start_date: '2022-08-03T23:00:00Z',
        },
        name: 'Mock file name',
        squad_ids: [8],
      },
    });
  });
});
