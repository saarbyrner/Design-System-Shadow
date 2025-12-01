import $ from 'jquery';
import exportTreatmentBilling from '../exportTreatmentBilling';

describe('exportTreatmentBilling', () => {
  let exportTreatmentBillingRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    exportTreatmentBillingRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() =>
        deferred.resolve({
          attachments: [],
          created_at: '2022-09-02T17:10:26+01:00',
          export_type: 'treatment_billing',
          id: 24,
          name: 'Treatment billing',
          status: 'pending',
        })
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await exportTreatmentBilling({
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
      export_type: 'treatment_billing',
      id: 24,
      name: 'Treatment billing',
      status: 'pending',
    });

    expect(exportTreatmentBillingRequest).toHaveBeenCalledTimes(1);
    expect(exportTreatmentBillingRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/treatment_billing',
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
