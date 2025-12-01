import $ from 'jquery';
import getPrincipleDeletionAvailability from '../getPrincipleDeletionAvailability';

const mockedData = [
  {
    ok: true,
    activities_count: 0,
  },
];

describe('getPrincipleDeletionAvailability', () => {
  let getPrincipleDeletionAvailabilityRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getPrincipleDeletionAvailabilityRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getPrincipleDeletionAvailability(4);

    expect(returnedData).toEqual(mockedData);

    expect(getPrincipleDeletionAvailabilityRequest).toHaveBeenCalledTimes(1);
    expect(getPrincipleDeletionAvailabilityRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/principles/4/check_destruction',
    });
  });
});
