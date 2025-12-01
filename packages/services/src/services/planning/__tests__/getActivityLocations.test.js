import { axios } from '@kitman/common/src/utils/services';
import { data as activityLocationsResponse } from '@kitman/services/src/mocks/handlers/planning/getActivityLocations';
import getActivityLocations from '../getActivityLocations';

describe('getActivityLocations', () => {
  let getActivityLocationsRequest;

  beforeEach(() => {
    getActivityLocationsRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => {
        return new Promise((resolve) => {
          return resolve({ data: activityLocationsResponse });
        });
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getActivityLocations();
    expect(returnedData).toEqual(activityLocationsResponse);

    expect(getActivityLocationsRequest).toHaveBeenCalledTimes(1);
    expect(getActivityLocationsRequest).toHaveBeenCalledWith(
      '/ui/activity_locations'
    );
  });
});
