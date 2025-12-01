import $ from 'jquery';
import exportMedicationRecords from '../exportMedicationRecords';

describe('exportMedicationRecords', () => {
  let exportMedicationRecordsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    exportMedicationRecordsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() =>
        deferred.resolve({
          attachments: [],
          created_at: '2022-09-02T17:10:26+01:00',
          export_type: 'medication_records',
          id: 24,
          name: 'Medication Records',
          status: 'pending',
        })
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await exportMedicationRecords({
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
      export_type: 'medication_records',
      id: 24,
      name: 'Medication Records',
      status: 'pending',
    });

    expect(exportMedicationRecordsRequest).toHaveBeenCalledTimes(1);
    expect(exportMedicationRecordsRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/medication_records',
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
