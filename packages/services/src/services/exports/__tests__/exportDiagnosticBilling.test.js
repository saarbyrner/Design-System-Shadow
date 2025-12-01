import $ from 'jquery';
import exportDiagnosticBilling from '../exportDiagnosticBilling';

describe('exportDiagnosticBilling', () => {
  let exportDiagnosticBillingRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    exportDiagnosticBillingRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() =>
        deferred.resolve({
          attachments: [],
          created_at: '2022-09-02T17:10:26+01:00',
          export_type: 'diagnostic_billing',
          id: 24,
          name: 'Diagnostics billing',
          status: 'pending',
        })
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await exportDiagnosticBilling({
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
      export_type: 'diagnostic_billing',
      id: 24,
      name: 'Diagnostics billing',
      status: 'pending',
    });

    expect(exportDiagnosticBillingRequest).toHaveBeenCalledTimes(1);
    expect(exportDiagnosticBillingRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/diagnostic_billing',
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
