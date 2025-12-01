import $ from 'jquery';
import exportConcussionBaselineAudit from '../exportConcussionBaselineAudit';

describe('exportConcussionBaselineAudit', () => {
  let exportConcussionBaselineRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    exportConcussionBaselineRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() =>
        deferred.resolve({
          attachments: [],
          created_at: '2022-09-02T17:10:26+01:00',
          export_type: 'concussion_baseline_audit',
          id: 24,
          name: 'Concussion Baseline Audit',
          status: 'pending',
        })
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await exportConcussionBaselineAudit({
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
      export_type: 'concussion_baseline_audit',
      id: 24,
      name: 'Concussion Baseline Audit',
      status: 'pending',
    });

    expect(exportConcussionBaselineRequest).toHaveBeenCalledTimes(1);
    expect(exportConcussionBaselineRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/concussion_baseline_audit',
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
