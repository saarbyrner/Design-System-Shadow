import $ from 'jquery';
import exportParticipantExposure from '../exportParticipantExposure';

describe('exportParticipantExposure', () => {
  let exportParticipantExposureRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    exportParticipantExposureRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() =>
        deferred.resolve({
          attachments: [],
          created_at: '2022-09-02T17:10:26+01:00',
          export_type: 'participant_exposure',
          id: 24,
          name: 'HAP Participant Exposure',
          status: 'pending',
        })
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await exportParticipantExposure({
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
      export_type: 'participant_exposure',
      id: 24,
      name: 'HAP Participant Exposure',
      status: 'pending',
    });

    expect(exportParticipantExposureRequest).toHaveBeenCalledTimes(1);
    expect(exportParticipantExposureRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/export_jobs/participant_exposure',
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
