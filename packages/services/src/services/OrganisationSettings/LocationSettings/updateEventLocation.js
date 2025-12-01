// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Location } from '@kitman/modules/src/OrganisationSettings/src/components/Locations/utils/types';
import { createUpdateEventLocationsUrl } from './utils/helpers';
import type { EventLocationFull } from './utils/types';

export const updateEventLocation = async (
  location: Location
): Promise<EventLocationFull> => {
  const { data } = await axios.put(
    createUpdateEventLocationsUrl(location.id.toString()),
    {
      ...location,
    }
  );

  return data;
};

export default updateEventLocation;
