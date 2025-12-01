// @flow

import { rest } from 'msw';
import type { CustomEventTypeResponse } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventTypes/utils/types';
import { customEventTypesUrlBase } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventTypes/utils/consts';

const parent1Name = 'BSWGE';
const parent1Child1Name = `${parent1Name} - Child`;
const parent1Child2Name = `${parent1Name} - Child2`;
const ungroupedChildName = 'PIBWR';

const squads = [{ id: 1, name: 'International Squad' }];

const parent1: CustomEventTypeResponse = {
  id: 10,
  parent_custom_event_type_id: null,
  name: parent1Name,
  organisation_id: 6,
  organisation: {
    id: 6,
    handle: 'kitman',
    name: 'Kitman Rugby Club',
  },
  parent_association: null,
  is_archived: false,
  is_selectable: false,
  shared: true,
  parents: [],
  squads: [],
};

const parent1Child1: CustomEventTypeResponse = {
  id: 323,
  parent_custom_event_type_id: 10,
  name: parent1Child1Name,
  organisation_id: 6,
  organisation: {
    id: 6,
    handle: 'kitman',
    name: 'Kitman Rugby Club',
  },
  parent_association: null,
  is_archived: false,
  is_selectable: true,
  parents: [{ name: parent1Name, id: 10, parent_custom_event_type_id: null }],
  squads: [],
};

const parent1Child2: CustomEventTypeResponse = {
  id: 324,
  parent_custom_event_type_id: 10,
  name: parent1Child2Name,
  organisation_id: 6,
  organisation: {
    id: 6,
    handle: 'kitman',
    name: 'Kitman Rugby Club',
  },
  parent_association: null,
  is_archived: false,
  is_selectable: true,
  parents: [{ name: parent1Name, id: 10, parent_custom_event_type_id: null }],
  squads: [],
};

const ungroupedEvent: CustomEventTypeResponse = {
  id: 311,
  parent_custom_event_type_id: null,
  name: ungroupedChildName,
  organisation_id: 6,
  organisation: {
    id: 6,
    handle: 'kitman',
    name: 'Kitman Rugby Club',
  },
  parent_association: null,
  is_archived: false,
  is_selectable: true,
  shared: true,
  parents: [],
  squads: [],
};

const data = [parent1, parent1Child1, parent1Child2, ungroupedEvent];

const dataWithoutChildren = [parent1, ungroupedEvent];

const scopedSquadsData: Array<CustomEventTypeResponse> = data.map((event) => ({
  ...event,
  squads,
}));

const handler = rest.get(customEventTypesUrlBase, (req, res, ctx) => {
  const dataToReturn = window.featureFlags['scoped-squads-custom-events']
    ? scopedSquadsData
    : data;
  return res(ctx.json(dataToReturn));
});

export { handler, data, scopedSquadsData, dataWithoutChildren };
