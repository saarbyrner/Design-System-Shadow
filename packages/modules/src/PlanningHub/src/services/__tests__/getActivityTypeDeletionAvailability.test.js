import $ from 'jquery';
import getActivityTypeDeletionAvailability from '../getActivityTypeDeletionAvailability';

const mockedData = [
  {
    ok: true,
    activities_count: 0,
  },
];

describe('getActivityTypeDeletionAvailability', () => {
  let getActivityTypeDeletionAvailabilityRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getActivityTypeDeletionAvailabilityRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getActivityTypeDeletionAvailability(4);

    expect(returnedData).toEqual(mockedData);

    expect(getActivityTypeDeletionAvailabilityRequest).toHaveBeenCalledTimes(1);
    expect(getActivityTypeDeletionAvailabilityRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/event_activity_types/4/check_destruction',
    });
  });
});
