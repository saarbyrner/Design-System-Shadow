import $ from 'jquery';
import saveEventParticipants from '../saveEventParticipants';

describe('saveEventParticipants', () => {
  let saveEventParticipantsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    saveEventParticipantsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve([]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await saveEventParticipants(1, [1, 2, 3]);

    expect(saveEventParticipantsRequest).toHaveBeenCalledTimes(1);
    expect(saveEventParticipantsRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/planning_hub/events/1/participants',
      contentType: 'application/json',
      data: JSON.stringify({
        athlete_ids: [1, 2, 3],
      }),
    });
  });
});
