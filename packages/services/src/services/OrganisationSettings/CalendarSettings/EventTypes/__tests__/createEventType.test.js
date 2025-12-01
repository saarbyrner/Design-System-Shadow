import { axios } from '@kitman/common/src/utils/services';
import { data as serverResponse } from '@kitman/services/src/mocks/handlers/OrganisationSettings/CalendarSettings/EventTypes/createEventType';
import { createEventType } from '../createEventType';

describe('createEventType', () => {
  let createEventTypeRequest;

  beforeEach(() => {
    createEventTypeRequest = jest
      .spyOn(axios, 'post')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and does not return a value', async () => {
    const response = await createEventType({});

    // to be ignored for now, will be used in the coming future
    const { squads: serverSquads, ...restServerResponse } = serverResponse;
    const { squads, ...restResponse } = response;

    expect(createEventTypeRequest).toHaveBeenCalledTimes(1);
    expect(restResponse).toEqual(restServerResponse);
  });
});
