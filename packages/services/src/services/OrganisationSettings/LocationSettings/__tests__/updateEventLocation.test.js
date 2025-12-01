import { axios } from '@kitman/common/src/utils/services';
import {
  data,
  eventId,
} from '@kitman/services/src/mocks/handlers/OrganisationSettings/LocationSettings/updateEventLocation';
import { updateEventLocation } from '../updateEventLocation';

describe('updateEventLocation', () => {
  let updateEventLocationRequest;

  beforeEach(() => {
    updateEventLocationRequest = jest.spyOn(axios, 'put');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the event location', async () => {
    const response = await updateEventLocation({ id: eventId });

    expect(updateEventLocationRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(data);
  });
});
