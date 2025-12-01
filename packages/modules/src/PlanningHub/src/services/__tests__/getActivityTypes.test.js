import $ from 'jquery';
import getActivityTypes from '../getActivityTypes';

const mockedData = [
  {
    id: 1,
    name: 'Warm up',
  },
  {
    id: 2,
    name: 'Training',
  },
];

describe('getActivityTypes', () => {
  let getActivityTypesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getActivityTypesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getActivityTypes();

    expect(returnedData).toEqual(mockedData);

    expect(getActivityTypesRequest).toHaveBeenCalledTimes(1);
    expect(getActivityTypesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/event_activity_types',
    });
  });
});
