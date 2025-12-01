import { axios } from '@kitman/common/src/utils/services';
import {
  data as serverResponse,
  eventId,
} from '@kitman/services/src/mocks/handlers/OrganisationSettings/CalendarSettings/EventTypes/updateEventType';

import { updateEventType } from '../updateEventType';

describe('updateEventType', () => {
  let updateEventTypeRequest;

  beforeEach(() => {
    updateEventTypeRequest = jest
      .spyOn(axios, 'put')
      .mockImplementation(() => ({ data: serverResponse }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and does not return a value', async () => {
    const response = await updateEventType({ id: eventId, squads: [] });

    expect(updateEventTypeRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(serverResponse);
  });
});
