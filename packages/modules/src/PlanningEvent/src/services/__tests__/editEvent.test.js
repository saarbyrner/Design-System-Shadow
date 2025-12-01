import $ from 'jquery';
import editEvent from '../editEvent';

const mockedEvent = {
  event: {
    id: 5,
    rpe_collection_athlete: true,
    mass_input: true,
    rpe_collection_kiosk: true,
  },
};

describe('editEvent', () => {
  let editEventRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    editEventRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedEvent));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await editEvent(5, {
      rpe_collection_athlete: true,
      mass_input: true,
      rpe_collection_kiosk: true,
    });

    expect(returnedData).toEqual(mockedEvent);

    expect(editEventRequest).toHaveBeenCalledTimes(1);
    expect(editEventRequest).toHaveBeenCalledWith({
      method: 'PATCH',
      url: '/planning_hub/events/5',
      contentType: 'application/json',
      data: JSON.stringify({
        rpe_collection_athlete: true,
        mass_input: true,
        rpe_collection_kiosk: true,
      }),
    });
  });
});
