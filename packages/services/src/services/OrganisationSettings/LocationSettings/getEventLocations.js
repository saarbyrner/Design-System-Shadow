// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { EventTypePermaId } from '@kitman/modules/src/OrganisationSettings/src/components/Locations/utils/types';
import { eventLocationSettingsUrl } from './utils/helpers';
import type { EventLocationResponse } from './utils/types';

type GetLocationsRequest = {
  isActive?: boolean,
  name?: string,
  eventTypes?: Array<EventTypePermaId>,
  locationTypes?: Array<string>,
};

export const getEventLocations = async ({
  isActive,
  name,
  eventTypes,
  locationTypes,
}: GetLocationsRequest): Promise<Array<EventLocationResponse>> => {
  const eventLocationRequest = { params: {} };
  if (isActive != null) {
    eventLocationRequest.params.active = isActive;
  }
  if (name !== undefined) {
    eventLocationRequest.params.name = name;
  }
  if (eventTypes !== undefined) {
    eventLocationRequest.params.event_type_perma_ids = eventTypes;
  }

  if (locationTypes !== undefined) {
    eventLocationRequest.params.location_types = locationTypes;
  }

  const { data } = await axios.get(eventLocationSettingsUrl, {
    params: eventLocationRequest.params,
  });

  return data;
};

export default getEventLocations;
