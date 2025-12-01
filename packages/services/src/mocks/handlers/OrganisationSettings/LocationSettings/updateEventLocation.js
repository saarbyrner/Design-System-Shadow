// @flow
import { rest } from 'msw';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import type { EventLocationFull } from '@kitman/services/src/services/OrganisationSettings/LocationSettings/utils/types';
import { eventLocationSettingsUrl } from '@kitman/services/src/services/OrganisationSettings/LocationSettings/utils/helpers';

export const eventId = 10;

const data: EventLocationFull = {
  id: eventId,
  parent_event_location_id: null,
  name: 'Mock Event Location',
  description: 'Mock Description',
  location_type: 'Training Field',
  address: 'Address',
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
  event_types: [],
  organisations: [],
  parent_associations: [],
  sports: [],
  parents: [],
};

const handler = rest.put(
  new RegExp(eventLocationSettingsUrl),
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
