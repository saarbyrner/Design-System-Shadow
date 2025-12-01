import $ from 'jquery';
import exportHapCovidBranch from '../exportHapCovidBranch';

describe('exportHapCovidBranch', () => {
  let exportHapCovidBranchRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    exportHapCovidBranchRequest = jest.spyOn($, 'ajax').mockImplementation(() =>
      deferred.resolve({
        attachments: [],
        created_at: '2022-09-02T17:10:26+01:00',
        export_type: 'hap_covid_branch',
        id: 24,
        name: 'HAP Covid Branch',
        status: 'pending',
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await exportHapCovidBranch({
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
      export_type: 'hap_covid_branch',
      id: 24,
      name: 'HAP Covid Branch',
      status: 'pending',
    });

    expect(exportHapCovidBranchRequest).toHaveBeenCalledTimes(1);
    expect(exportHapCovidBranchRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/hap_covid_branch',
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
