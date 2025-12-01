import { axios } from '@kitman/common/src/utils/services';
import { activeLocations } from '@kitman/services/src/mocks/handlers/OrganisationSettings/LocationSettings/getEventLocations';
import { createEventLocation } from '../createEventLocation';

describe('createEventLocation', () => {
  let createEventLocationRequest;

  beforeEach(() => {
    createEventLocationRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the event location', async () => {
    const locationToCreate = {
      name: activeLocations[0].name,
      location_type: activeLocations[0].location_type,
      event_types: activeLocations[0].event_types,
      active: activeLocations[0].active,
      public: false,
    };
    const response = await createEventLocation(locationToCreate);

    expect(createEventLocationRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(activeLocations[0]);
  });
});
