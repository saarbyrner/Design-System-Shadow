import $ from 'jquery';
import exportDiagnosticsRecords from '../exportDiagnosticsRecords';

describe('exportDiagnosticsRecords', () => {
  let exportDiagnosticsRecordsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    exportDiagnosticsRecordsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() =>
        deferred.resolve({
          attachments: [],
          created_at: '2022-09-02T17:10:26+01:00',
          export_type: 'diagnostics_report',
          id: 24,
          name: 'Diagnostic Records',
          status: 'pending',
        })
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await exportDiagnosticsRecords({
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
      export_type: 'diagnostics_report',
      id: 24,
      name: 'Diagnostic Records',
      status: 'pending',
    });

    expect(exportDiagnosticsRecordsRequest).toHaveBeenCalledTimes(1);
    expect(exportDiagnosticsRecordsRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/diagnostics_report',
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
