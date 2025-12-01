import $ from 'jquery';
import exportHapAuthStatus from '../exportHapAuthStatus';

describe('exportHapAuthStatus', () => {
  let exportHapAuthStatusRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    exportHapAuthStatusRequest = jest.spyOn($, 'ajax').mockImplementation(() =>
      deferred.resolve({
        attachments: [],
        created_at: '2022-09-02T17:10:26+01:00',
        export_type: 'hap_authorization_status',
        id: 24,
        name: 'HAP Authorization Status',
        status: 'pending',
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await exportHapAuthStatus({
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
      export_type: 'hap_authorization_status',
      id: 24,
      name: 'HAP Authorization Status',
      status: 'pending',
    });

    expect(exportHapAuthStatusRequest).toHaveBeenCalledTimes(1);
    expect(exportHapAuthStatusRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/hap_authorization_status',
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
