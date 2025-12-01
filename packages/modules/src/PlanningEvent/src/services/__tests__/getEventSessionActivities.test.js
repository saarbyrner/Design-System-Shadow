import $ from 'jquery';
import getEventSessionActivities from '../getEventSessionActivities';

const mockedEventSessionActivities = {
  athletes: [],
  duration: null,
  id: 1,
  principles: [
    {
      id: 1,
      name: 'Long pass',
      principle_categories: [],
      principle_types: [
        {
          id: 1,
          name: 'Technical',
        },
      ],
      phases: [],
    },
  ],
  event_activity_drill: null,
  event_activity_type: {
    id: 1,
    name: 'Training',
    squads: [{ id: 8, name: 'International Squad' }],
  },
  users: [],
};

describe('getEventSessionActivities', () => {
  let getEventSessionActivitiesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getEventSessionActivitiesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedEventSessionActivities));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getEventSessionActivities(1);

    expect(returnedData).toEqual(mockedEventSessionActivities);

    expect(getEventSessionActivitiesRequest).toHaveBeenCalledTimes(1);
    expect(getEventSessionActivitiesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/events/1/event_activities',
    });
  });
});
