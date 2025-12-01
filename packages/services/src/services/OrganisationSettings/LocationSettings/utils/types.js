// @flow
import type { EventTypePermaId } from '@kitman/modules/src/OrganisationSettings/src/components/Locations/utils/types';
import type { Organisation } from '../../../getOrganisation';
import type { Association } from '../../../getCurrentAssociation';
import type { Sport } from '../../../getSport';

export type EventLocationResponse = {
  id: number | string,
  name: string,
  location_type: string,
  event_types: Array<{
    id: number,
    perma_id: EventTypePermaId,
    name: string,
  }>,
  active: boolean,
};
export type EventLocationFull = EventLocationResponse & {
  parent_event_location_id: number | null,
  description: string,
  address: string,
  uri: string,
  public: boolean,
  owner_organisation: Organisation,
  created_by: null,
  organisations: Array<Organisation>,
  parent_associations: Array<Association>,
  sports: Array<Sport>,
  parents: Array<EventLocationResponse>,
};
