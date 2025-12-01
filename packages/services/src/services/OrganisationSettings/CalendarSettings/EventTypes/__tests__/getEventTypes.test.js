import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/OrganisationSettings/CalendarSettings/EventTypes/getEventTypes';
import { getEventTypes } from '../getEventTypes';

describe('getEventTypes', () => {
  let getEventTypesRequest;

  beforeEach(() => {
    getEventTypesRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getEventTypes();
    expect(returnedData).toEqual(serverResponse);

    expect(getEventTypesRequest).toHaveBeenCalledTimes(1);
  });
});
