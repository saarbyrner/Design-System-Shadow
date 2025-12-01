// @flow
import { rest } from 'msw';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import {
  locationsMock,
  archivedLocationsMock,
} from '@kitman/modules/src/OrganisationSettings/src/components/Locations/utils/consts';
import type { EventLocationFull } from '@kitman/services/src/services/OrganisationSettings/LocationSettings/utils/types';
import { eventLocationSettingsUrl } from '@kitman/services/src/services/OrganisationSettings/LocationSettings/utils/helpers';

export const eventId = 10;

const commonData = {
  id: eventId,
  parent_event_location_id: null,
  address: 'Address',
  description: 'Description',
  uri: 'Mock URL',
  active: true,
  public: true,
  owner_organisation: {
    id: 8,
    name: 'Owner Org',
    coding_system_key: codingSystemKeys.OSICS_10,
    logo_full_path: '',
  },
  created_by: null,
  organisations: [],
  parent_associations: [],
  sports: [],
  parents: [],
};

const activeLocations: Array<EventLocationFull> = locationsMock.map(
  ({
    id,
    name,
    location_type: locationType,
    event_types: eventTypes,
    active,
  }) => ({
    ...commonData,
    id: parseInt(id, 10),
    name,
    location_type: locationType,
    event_types: eventTypes.map((eventType) => ({
      perma_id: eventType,
      id: 10,
      name: 'test name',
    })),
    active,
  })
);

const getActiveLocationsByName = (name: string): Array<EventLocationFull> => {
  return activeLocations.filter(({ name: locationName }) => {
    return locationName.includes(name);
  });
};

const archivedLocations: Array<EventLocationFull> = archivedLocationsMock.map(
  ({
    id,
    name,
    location_type: locationType,
    event_types: eventTypes,
    active,
  }) => ({
    ...commonData,
    id: parseInt(id, 10),
    name,
    location_type: locationType,
    event_types: eventTypes.map((eventType) => ({
      perma_id: eventType,
      id: 10,
      name: 'test name',
    })),
    active,
  })
);

const handler = rest.get(
  new RegExp(eventLocationSettingsUrl),
  (req, res, ctx) => {
    const query = req.url.searchParams;
    const isActive = query.get('active');
    const name = query.get('name');

    // query.get returns 'true' or 'false' if the param was included, or not included
    if (isActive === 'true') {
      if (name) {
        const activeLocationsByName = getActiveLocationsByName(name);
        return res(ctx.json(activeLocationsByName));
      }

      return res(ctx.json(activeLocations));
    }

    if (isActive === 'false') {
      if (name) {
        return res(
          ctx.json(
            archivedLocations.filter(({ name: locationName }) =>
              locationName.includes(name)
            )
          )
        );
      }

      return res(ctx.json(archivedLocations));
    }

    return res(ctx.json([...activeLocations, archivedLocations]));
  }
);

export {
  handler,
  archivedLocations,
  activeLocations,
  getActiveLocationsByName,
};
