// @flow
import structuredClone from 'core-js/stable/structured-clone';
import type { CustomEventTypeIP } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventTypes/utils/types';
import type {
  GroupedEventTypesArray,
  GroupedArchivedEventTypesArray,
} from '../types';
import { UNGROUPED_ID } from '../consts';
import { getNewGroupId, getNewItemId } from '../../../utils/helpers';

const parent1Name = 'BSWGE';
const parent1Id = '10';
const parent1Child1Name = `${parent1Name} - Child`;
const parent1Child2Name = `${parent1Name} - Child2`;
const ungroupedChildName = 'PIBWR';
const ungroupedParentName = 'Ungrouped';
const archivedParent1Name = 'BSWGE-Archived';
const archivedParent1Id = '323';
const archivedParent1Child1Name = `${archivedParent1Name} - Child`;
const archivedParent1Child2Name = `${archivedParent1Name} - Child2`;
export const someNewName = 'KWLPO';

const parent1: CustomEventTypeIP = {
  id: parent1Id,
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
  parents: [],
  squads: [],
};

const archivedParent1: CustomEventTypeIP = {
  id: '140',
  parent_custom_event_type_id: null,
  name: archivedParent1Name,
  organisation_id: 6,
  organisation: {
    id: 6,
    handle: 'kitman',
    name: 'Kitman Rugby Club',
  },
  parent_association: null,
  is_archived: true,
  is_selectable: false,
  parents: [],
  squads: [],
};

const parent1Child1: CustomEventTypeIP = {
  id: '323',
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
  parents: [
    { name: parent1Name, id: +parent1Id, parent_custom_event_type_id: null },
  ],
  squads: [],
};

const archivedParent1Child1: CustomEventTypeIP = {
  id: archivedParent1Id,
  parent_custom_event_type_id: 10,
  name: archivedParent1Child1Name,
  organisation_id: 6,
  organisation: {
    id: 6,
    handle: 'kitman',
    name: 'Kitman Rugby Club',
  },
  parent_association: null,
  is_archived: false,
  is_selectable: true,
  parents: [
    {
      name: archivedParent1Name,
      id: +archivedParent1Id,
      parent_custom_event_type_id: null,
    },
  ],
  squads: [],
};

const parent1Child1Archived: CustomEventTypeIP = {
  ...parent1Child1,
  is_archived: true,
};

const parent1Child2: CustomEventTypeIP = {
  id: '324',
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
  parents: [
    {
      name: archivedParent1Name,
      id: +archivedParent1Id,
      parent_custom_event_type_id: null,
    },
  ],
  squads: [],
};

const archivedParent1Child2: CustomEventTypeIP = {
  id: '324',
  parent_custom_event_type_id: 10,
  name: archivedParent1Child2Name,
  organisation_id: 6,
  organisation: {
    id: 6,
    handle: 'kitman',
    name: 'Kitman Rugby Club',
  },
  parent_association: null,
  is_archived: false,
  is_selectable: true,
  parents: [
    { name: parent1Name, id: +parent1Id, parent_custom_event_type_id: null },
  ],
  squads: [],
};

const parent1Child2Archived: CustomEventTypeIP = {
  ...parent1Child2,
  is_archived: true,
};

const ungroupedEvent: CustomEventTypeIP = {
  id: '311',
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
  parents: [],
  squads: [],
};

const ungroupedEventArchived: CustomEventTypeIP = {
  ...ungroupedEvent,
  is_archived: true,
};

export const rawEvents = [
  parent1,
  parent1Child1,
  parent1Child2,
  ungroupedEvent,
];

export const rawEventsParent1Child1Archived = [
  parent1,
  parent1Child1Archived,
  parent1Child2,
  ungroupedEvent,
];

export const groupedEventsParent1Child1Archived: GroupedEventTypesArray = [
  {
    ...parent1,
    children: [parent1Child2],
  },
  {
    id: UNGROUPED_ID,
    children: ([ungroupedEvent]: Array<CustomEventTypeIP>),
    name: ungroupedParentName,
    is_archived: false,
    is_selectable: false,
    squads: [],
  },
];

export const archivedGroupedEventsParent1Child1Archived: GroupedEventTypesArray =
  [{ ...parent1, children: [parent1Child1Archived] }];

export const rawEventsParent1ChildrenArchived = [
  parent1,
  parent1Child1Archived,
  parent1Child2Archived,
  ungroupedEvent,
];

export const groupedEventsParent1ChildrenArchived: GroupedEventTypesArray = [
  {
    ...parent1,
    children: [],
  },
  {
    id: UNGROUPED_ID,
    children: ([ungroupedEvent]: Array<CustomEventTypeIP>),
    name: ungroupedParentName,
    is_archived: false,
    is_selectable: false,
    squads: [],
  },
];

export const archivedGroupedEventsParent1ChildrenArchived: GroupedEventTypesArray =
  [{ ...parent1, children: [parent1Child1Archived, parent1Child2Archived] }];

export const rawEventsArchivedUngrouped = [
  parent1,
  parent1Child1,
  parent1Child2,
  ungroupedEventArchived,
];

export const groupedEventsArchivedUngrouped: GroupedEventTypesArray = [
  {
    ...parent1,
    children: [parent1Child1, parent1Child2],
  },
];

export const archivedGroupedEventsUngroupedArchived: GroupedEventTypesArray = [
  {
    id: UNGROUPED_ID,
    children: ([ungroupedEventArchived]: Array<CustomEventTypeIP>),
    name: ungroupedParentName,
    is_archived: true,
    is_selectable: false,
    squads: [],
  },
];

export const rawEventsNoUngrouped = [parent1, parent1Child1, parent1Child2];

export const groupedEventsNoUngrouped = [
  {
    ...parent1,
    children: [parent1Child1, parent1Child2],
  },
];

export const groupedEvents: GroupedEventTypesArray = [
  {
    ...parent1,
    children: [parent1Child1, parent1Child2],
  },
  {
    id: UNGROUPED_ID,
    children: ([ungroupedEvent]: Array<CustomEventTypeIP>),
    name: ungroupedParentName,
    is_archived: false,
    is_selectable: false,
    squads: [],
  },
];

export const groupedEventsWithDuplicateInParentNames: GroupedEventTypesArray =
  groupedEvents.concat([
    {
      ...parent1,
      id: '4568',
      children: [],
    },
  ]);

export const eventNameSetMock = new Set<string>(
  [
    parent1Name,
    parent1Child1Name,
    parent1Child2Name,
    archivedParent1Name,
    archivedParent1Child1Name,
    archivedParent1Child2Name,
    ungroupedChildName,
  ].map((name) => name.toLocaleLowerCase())
);

export const groupedEventsWithDuplicateInChildrenNamesSameParent =
  structuredClone(groupedEvents);
groupedEventsWithDuplicateInChildrenNamesSameParent[0].children[0].name =
  parent1Child2Name;

export const eventNameSetMockDuplicateChildrenNameSameParent = new Set<string>(
  [
    parent1Name,
    parent1Child2Name,
    archivedParent1Name,
    archivedParent1Child1Name,
    archivedParent1Child2Name,
    ungroupedChildName,
  ].map((name) => name.toLocaleLowerCase())
);

export const groupedEventsWithDuplicateInChildrenNamesDifferentParent: GroupedEventTypesArray =
  groupedEvents.concat([
    {
      ...parent1,
      id: '796',
      name: someNewName,
      children: [parent1Child2],
    },
  ]);

export const eventNameSetMockDuplicateChildrenNameDifferentParent =
  new Set<string>(
    [
      parent1Name,
      parent1Child1Name,
      parent1Child2Name,
      archivedParent1Name,
      archivedParent1Child1Name,
      archivedParent1Child2Name,
      ungroupedChildName,
      someNewName,
    ].map((name) => name.toLocaleLowerCase())
  );

export const groupedEventsWithDuplicateNameInUngroupedEvents: GroupedEventTypesArray =
  [
    {
      ...parent1,
      children: [parent1Child1, parent1Child2],
    },
    {
      id: UNGROUPED_ID,
      children: ([
        { ...ungroupedEvent, name: parent1Child1Name },
      ]: Array<CustomEventTypeIP>),
      name: ungroupedParentName,
      is_archived: false,
      is_selectable: false,
      squads: [],
    },
  ];

export const eventNameSetMockDuplicatesInUngroupedEvents = new Set<string>(
  [
    parent1Name,
    parent1Child1Name,
    parent1Child2Name,
    archivedParent1Name,
    archivedParent1Child1Name,
    archivedParent1Child2Name,
  ].map((name) => name.toLocaleLowerCase())
);

export const archivedGroupedEventsWithoutDuplicateNames: GroupedArchivedEventTypesArray =
  [
    {
      ...archivedParent1,
      children: [archivedParent1Child1, archivedParent1Child2],
    },
  ];

export const archivedGroupedEventsWithDuplicateNames: GroupedArchivedEventTypesArray =
  [
    {
      ...archivedParent1,
      children: [
        { ...archivedParent1Child1, name: parent1Child1Name },
        archivedParent1Child2,
      ],
    },
  ];
export const eventNameSetMockDuplicatesInArchivedEvents = new Set<string>(
  [
    parent1Name,
    parent1Child1Name,
    parent1Child2Name,
    archivedParent1Name,
    archivedParent1Child2Name,
  ].map((name) => name.toLocaleLowerCase())
);

export const archivedGroupedEventsWithDuplicateNamesInArchivedParent: GroupedArchivedEventTypesArray =
  [
    {
      ...archivedParent1,
      is_archived: true,
      children: [archivedParent1Child1, archivedParent1Child2],
    },
  ];

export const groupedEventsWithDuplicateNamesInArchivedParent: GroupedEventTypesArray =
  [
    {
      ...parent1,
      children: [
        { ...parent1Child1, name: archivedParent1Name },
        parent1Child2,
      ],
    },
    {
      id: UNGROUPED_ID,
      children: ([ungroupedEvent]: Array<CustomEventTypeIP>),
      name: ungroupedParentName,
      is_archived: false,
      is_selectable: false,
      squads: [],
    },
  ];

export const eventNameSetMockDuplicatesInEventsWithArchivedParent =
  new Set<string>(
    [
      parent1Name,
      parent1Child2Name,
      archivedParent1Name,
      archivedParent1Child1Name,
      archivedParent1Child2Name,
      ungroupedChildName,
    ].map((name) => name.toLocaleLowerCase())
  );

export const archivedGroupedEventsWithoutDuplicateNamesInNonArchivedParent: GroupedArchivedEventTypesArray =
  [
    {
      ...archivedParent1,
      is_archived: false,
      children: [archivedParent1Child1, archivedParent1Child2],
    },
  ];

export const groupedEventsWithoutDuplicateNamesInNonArchivedParent: GroupedEventTypesArray =
  [
    {
      ...parent1,
      children: [parent1Child1, parent1Child2],
    },
    {
      id: UNGROUPED_ID,
      children: ([ungroupedEvent]: Array<CustomEventTypeIP>),
      name: ungroupedParentName,
      is_archived: false,
      is_selectable: false,
      squads: [],
    },
  ];

export const eventNameSetMockDuplicatesInEventsWithNonArchivedParent =
  new Set<string>(
    [
      parent1Name,
      parent1Child1Name,
      parent1Child2Name,
      archivedParent1Name,
      archivedParent1Child1Name,
      archivedParent1Child2Name,
      ungroupedChildName,
    ].map((name) => name.toLocaleLowerCase())
  );

export const archivedGroupedEventsDuplicateCaseInsensitive: GroupedArchivedEventTypesArray =
  [
    {
      ...archivedParent1,
      children: [archivedParent1Child1, archivedParent1Child2],
    },
  ];

export const groupedEventsDuplicateCaseInsensitive: GroupedEventTypesArray = [
  {
    ...parent1,
    name: parent1Child1Name.toLocaleLowerCase(),
    children: [parent1Child1, parent1Child2],
  },
  {
    id: UNGROUPED_ID,
    children: ([ungroupedEvent]: Array<CustomEventTypeIP>),
    name: ungroupedParentName,
    is_archived: false,
    is_selectable: false,
    squads: [],
  },
];

export const eventNameSetMockDuplicatesCaseInsensitive = new Set<string>(
  [
    parent1Child1Name,
    parent1Child2Name,
    archivedParent1Name,
    archivedParent1Child1Name,
    archivedParent1Child2Name,
    ungroupedChildName,
  ].map((name) => name.toLocaleLowerCase())
);

/** */
export const clonedOriginalFormData = structuredClone(groupedEvents);

// updates
const parent1NewName = 'Ash';
clonedOriginalFormData[0].name = parent1NewName;
clonedOriginalFormData[0].squads = [];

const parent1Child1NewName = 'Pikcahu';
clonedOriginalFormData[0].children[0].name = parent1Child1NewName;

const ungrouped1NewName = 'Raichu';
const originalUngroupedChild = clonedOriginalFormData.at(-1).children[0];
originalUngroupedChild.name = ungrouped1NewName;
originalUngroupedChild.squads = [];

// new child
const newChildName = 'Pichu';
clonedOriginalFormData[0].children.push({
  id: getNewItemId(),
  name: newChildName,
  squads: [],
});

// new ungrouped
const newUngroupedChildName = 'Oak';
clonedOriginalFormData.at(-1).children.push({
  id: getNewItemId(),
  name: newUngroupedChildName,
  squads: [],
});

// new group
const newGroupName = 'Pokémons';
const newGroupChild1Name = 'Caterpillar';
const newGroupChild2Name = 'Weedle';
const newGroup = {
  id: getNewGroupId(),
  name: newGroupName,
  squads: [],
  children: [
    {
      id: getNewItemId(),
      name: newGroupChild1Name,
      squads: [],
    },
    {
      id: getNewItemId(),
      name: newGroupChild2Name,
      squads: [],
    },
  ],
};
clonedOriginalFormData.push(newGroup);

export const expectedNewGroups = [
  {
    name: newGroupName,
    children: [
      {
        name: newGroupChild1Name,
        parent_custom_event_type_id: null,
        is_selectable: true,
        squads: [],
      },
      {
        name: newGroupChild2Name,
        parent_custom_event_type_id: null,
        is_selectable: true,
        squads: [],
      },
    ],
    is_selectable: false,
    parent_custom_event_type_id: null,
    squads: [],
  },
];
export const expectedUpdatedEvents = [
  {
    ...clonedOriginalFormData[0],
    name: parent1NewName,
    squads: [],
    children: undefined,
    colour: '',
  },
  {
    ...clonedOriginalFormData[0].children[0],
    name: parent1Child1NewName,
  },
  {
    ...originalUngroupedChild,
    name: ungrouped1NewName,
    squads: [],
  },
];
export const expectedNewEvents = [
  {
    name: newChildName,
    is_selectable: true,
    parent_custom_event_type_id: +parent1Id,
    squads: [],
  },
  {
    name: newUngroupedChildName,
    is_selectable: true,
    parent_custom_event_type_id: null,
    squads: [],
  },
];

export const responseEvent = { ...parent1, id: +parent1Id };
export const iPEvent = { ...parent1 };
