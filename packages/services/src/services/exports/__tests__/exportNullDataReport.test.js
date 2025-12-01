import $ from 'jquery';
import exportNullDataReport from '../exportNullDataReport';

describe('exportNullDataReport', () => {
  let exportNullDataReportRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    exportNullDataReportRequest = jest.spyOn($, 'ajax').mockImplementation(() =>
      deferred.resolve({
        attachments: [],
        created_at: '2022-09-02T17:10:26+01:00',
        export_type: 'null_data_report',
        id: 24,
        name: 'Null Data Report',
        status: 'pending',
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await exportNullDataReport({
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
      export_type: 'null_data_report',
      id: 24,
      name: 'Null Data Report',
      status: 'pending',
    });

    expect(exportNullDataReportRequest).toHaveBeenCalledTimes(1);
    expect(exportNullDataReportRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/null_data_report',
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
