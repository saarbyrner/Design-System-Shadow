import $ from 'jquery';
import updateEventSessionActivity from '../updateEventSessionActivity';

const mockedEventSessionActivity = {
  athletes: [],
  duration: null,
  id: 1,
  principles: [
    {
      id: 1,
      name: 'First principle',
      principle_types: [
        {
          id: 1,
          name: 'Technical',
        },
      ],
    },
  ],
  users: [],
};

describe('updateEventSessionActivity', () => {
  let updateEventSessionActivityRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    updateEventSessionActivityRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedEventSessionActivity));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await updateEventSessionActivity(1, 1, {
      duration: null,
      principle_ids: [1],
      athlete_ids: [],
      user_ids: [],
    });

    expect(returnedData).toEqual(mockedEventSessionActivity);

    expect(updateEventSessionActivityRequest).toHaveBeenCalledTimes(1);
    expect(updateEventSessionActivityRequest).toHaveBeenCalledWith({
      method: 'PATCH',
      url: '/ui/planning_hub/events/1/event_activities/1',
      contentType: 'application/json',
      data: JSON.stringify({
        duration: null,
        principle_ids: [1],
        athlete_ids: [],
        user_ids: [],
      }),
    });
  });
});
