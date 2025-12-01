// @flow
import { rest } from 'msw';

import {
  getCustomEventTypesRoute,
  type CustomEventTypeFull,
} from '@kitman/services/src/services/planning/getCustomEventTypes';

const commonData = {
  created_at: '2023-07-06T15:46:02Z',
  updated_at: '2023-07-06T15:46:02Z',
  is_selectable: true,
  is_archived: false,
  squads: [],
  parent_association: null,
};

export const eventTypeWithSquads = {
  ...commonData,
  id: 23,
  name: 'Squads',
  parent_custom_event_type_id: null,
  parents: [],
  squads: [
    {
      id: 8,
      name: 'International Squad',
    },
  ],
};

export const eventTypeWithParentAssociation = {
  ...commonData,
  id: 24,
  name: 'ParentAssociation',
  parent_custom_event_type_id: null,
  parents: [],
  parent_association: {
    id: 88,
    name: 'Mulberries Burkinabè basketball Body',
    abbreviation: 'MBBB',
    country: {
      abbreviation: 'GB',
      id: 4,
      name: 'United Kingdom',
    },
  },
};

const data: CustomEventTypeFull[] = [
  {
    id: 1,
    name: 'Travel',
    ...commonData,
    parent_custom_event_type_id: null,
    parents: [],
    squads: [],
  },
  {
    id: 2,
    name: 'Nutrition Meeting',
    ...commonData,
    parent_custom_event_type_id: 56,
    squads: [],
    parents: [
      {
        id: 56,
        name: 'Mental Wellbeing',
        parent_custom_event_type_id: 567,
        ...commonData,
      },
      {
        id: 567,
        name: 'Player Care',
        parent_custom_event_type_id: null,
        ...commonData,
      },
    ],
  },
  {
    id: 2,
    name: 'Another Player Care Type',
    ...commonData,
    parent_custom_event_type_id: 5698,
    squads: [],
    parents: [
      {
        id: 5698,
        name: 'Learning Sessions',
        parent_custom_event_type_id: 567,
        ...commonData,
      },
      {
        id: 567,
        name: 'Player Care',
        parent_custom_event_type_id: null,
        ...commonData,
      },
    ],
  },
  {
    id: 100,
    name: 'Ungrouped Option',
    ...commonData,
    parent_custom_event_type_id: null,
    parents: [],
    squads: [],
  },
];

const squadResponseData = [
  {
    id: 1001,
    name: 'Option For Current Squad',
    ...commonData,
    parent_custom_event_type_id: null,
    parents: [],
    squads: [{ id: 8 }],
  },
  {
    id: 10012,
    name: 'Second Option For Current Squad',
    ...commonData,
    parent_custom_event_type_id: null,
    parents: [],
    squads: [{ id: 8 }],
  },
];

const handler = rest.get(getCustomEventTypesRoute, (req, res, ctx) => {
  const query = req.url.searchParams;
  const isArchived = query.get('is_archived');
  const isSelectable = query.get('is_selectable');
  const squads = query.getAll('squads[]');
  if (squads.length && !!isArchived && isSelectable) {
    return res(ctx.json(squadResponseData));
  }

  if (!!isArchived && isSelectable) {
    return res(ctx.json(data));
  }

  return res(ctx.json([]));
});

export { handler, data, squadResponseData };
