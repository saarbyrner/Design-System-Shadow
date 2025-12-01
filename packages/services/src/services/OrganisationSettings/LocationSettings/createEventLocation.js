// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { NewLocation } from '@kitman/modules/src/OrganisationSettings/src/components/Locations/utils/types';
import { eventLocationSettingsUrl } from './utils/helpers';
import type { EventLocationFull } from './utils/types';

export const createEventLocation = async (
  location: NewLocation
): Promise<EventLocationFull> => {
  const { data } = await axios.post(eventLocationSettingsUrl, location);

  return data;
};

export default createEventLocation;
