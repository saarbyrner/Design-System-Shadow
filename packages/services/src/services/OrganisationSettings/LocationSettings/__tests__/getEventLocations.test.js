import { axios } from '@kitman/common/src/utils/services';
import {
  archivedLocations,
  activeLocations,
  getActiveLocationsByName,
} from '@kitman/services/src/mocks/handlers/OrganisationSettings/LocationSettings/getEventLocations';
import getEventLocation from '../getEventLocations';

describe('getEventLocations', () => {
  let getEventLocationsRequest;

  beforeEach(() => {
    getEventLocationsRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the active event locations', async () => {
    const response = await getEventLocation({ isActive: true });

    expect(getEventLocationsRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(activeLocations);
  });

  it('calls the correct endpoint and returns the archived event locations', async () => {
    const response = await getEventLocation({ isActive: false });

    expect(getEventLocationsRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(archivedLocations);
  });

  it('calls the correct endpoint when a name exists and returns the corresponding locations', async () => {
    const response = await getEventLocation({
      isActive: true,
      name: activeLocations[0].name,
    });

    expect(getEventLocationsRequest).toHaveBeenCalledTimes(1);
    expect(response).toEqual(getActiveLocationsByName(activeLocations[0].name));
  });
});
