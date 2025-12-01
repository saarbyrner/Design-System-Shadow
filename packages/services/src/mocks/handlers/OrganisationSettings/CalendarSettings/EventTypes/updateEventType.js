// @flow
import { rest } from 'msw';
import type { CustomEventTypeResponse } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventTypes/utils/types';
import { customEventTypesUrlBase } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventTypes/utils/consts';

export const eventId = 10;

const data: CustomEventTypeResponse = {
  id: eventId,
  parent_custom_event_type_id: null,
  name: 'someName',
  organisation_id: 6,
  organisation: {
    id: 6,
    handle: 'kitman',
    name: 'Kitman Rugby Club',
  },
  parent_association: null,
  is_archived: false,
  is_selectable: false,
  parents: [],
  squads: [
    {
      id: 2731,
      name: '1st team',
    },
  ],
};

const handler = rest.put(new RegExp(customEventTypesUrlBase), (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
