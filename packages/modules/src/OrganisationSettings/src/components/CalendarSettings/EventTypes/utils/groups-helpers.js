/* eslint-disable camelcase */
// @flow
import { isEqual } from 'lodash';

import type { Translation } from '@kitman/common/src/types/i18n';
import type {
  CustomEventTypeIP,
  NewCustomEventType,
  CustomEventTypeResponse,
} from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventTypes/utils/types';
import { UNGROUPED_ID } from './consts';
import type {
  GroupedEventTypesArray,
  GroupedArchivedEventTypesArray,
  IdToEventTypeMap,
  IdToGroupedEventTypesMap,
  UngroupedEventTypes,
  UngroupedArchivedEventTypes,
  GroupedEventTypes,
  NewCustomEvent,
} from './types';
import { NEW_GROUP_ID_PREFIX, NEW_EVENT_ID_PREFIX } from '../../utils/consts';

export const mapResponseEventTypeToIP = ({
  id,
  squads,
  ...restEvent
}: CustomEventTypeResponse): CustomEventTypeIP => {
  const mappedSquads = squads.map((squad) => squad.id);
  const stringId = id.toString();

  const event: CustomEventTypeIP = {
    ...restEvent,
    squads: mappedSquads,
    id: stringId,
  };
  return event;
};

export const prepareEventsInGroups = (
  events: Array<CustomEventTypeIP>,
  t: Translation
): {
  groups: GroupedEventTypesArray,
  archivedGroups: GroupedArchivedEventTypesArray,
} => {
  const idToGroupedEventTypesMap: IdToGroupedEventTypesMap = new Map();
  const idToGroupedArchivedEventTypesMap: IdToGroupedEventTypesMap = new Map();
  const eventsToBeAddedToMapLater: Array<CustomEventTypeIP> = [];
  const ungroupedEvents: Array<CustomEventTypeIP> = [];
  const ungroupedArchivedEvents: Array<CustomEventTypeIP> = [];

  events.forEach((event) => {
    const { is_selectable, id, parent_custom_event_type_id, is_archived } =
      event;

    if (is_selectable) {
      if (parent_custom_event_type_id === null) {
        // ungrouped, not a parent
        if (is_archived) ungroupedArchivedEvents.push(event);
        else ungroupedEvents.push(event);
      } else {
        const parentId = parent_custom_event_type_id.toString();
        const parent = is_archived
          ? idToGroupedArchivedEventTypesMap.get(parentId)
          : idToGroupedEventTypesMap.get(parentId);

        if (parent) parent.children.push(event); // child
        else eventsToBeAddedToMapLater.push(event); // parent hasn't been mapped yet
      }
    } else {
      // parent
      if (!is_archived)
        idToGroupedEventTypesMap.set(id, { ...event, children: [] });
      // adding this because we can't know if the *child* is archived or not in this phase, will be deleted if the are no children
      idToGroupedArchivedEventTypesMap.set(id, { ...event, children: [] });
    }
  });
  eventsToBeAddedToMapLater.forEach((event) => {
    const { parent_custom_event_type_id, is_archived } = event;

    if (parent_custom_event_type_id) {
      const parentId = parent_custom_event_type_id.toString();
      const parent = is_archived
        ? idToGroupedArchivedEventTypesMap.get(parentId)
        : idToGroupedEventTypesMap.get(parentId);

      if (parent) parent.children.push(event); // child
    }
  });

  const ungroupedParent: UngroupedEventTypes = {
    id: UNGROUPED_ID,
    children: ungroupedEvents,
    name: t('Ungrouped'),
    is_archived: false,
    is_selectable: false,
    squads: [],
  };

  const ungroupedArchivedParent: UngroupedArchivedEventTypes = {
    id: UNGROUPED_ID,
    children: ungroupedArchivedEvents,
    name: t('Ungrouped'),
    is_archived: true,
    is_selectable: false,
    squads: [],
  };

  const groups = [...idToGroupedEventTypesMap.values()].concat(
    ungroupedEvents.length > 0 ? [ungroupedParent] : []
  );

  const archivedGroups = [...idToGroupedArchivedEventTypesMap.values()]
    .filter(
      // remove (non archived) parents without any archived children
      ({ is_archived, children }) =>
        is_archived || (!is_archived && children.length > 0)
    )
    .concat(
      ungroupedArchivedEvents.length > 0 ? [ungroupedArchivedParent] : []
    );

  return { archivedGroups, groups };
};

export const reduceGroupsIntoEventNames = (
  groups: GroupedEventTypesArray,
  archivedGroups: GroupedArchivedEventTypesArray
) => {
  let duplicatesExist = false;
  const parentIdsSet = new Set<string>();
  const reducedSet = [...groups, ...archivedGroups].reduce<Set<string>>(
    (prevSet, group) => {
      const localPrevSet = new Set([...prevSet]);

      const { name, children, id } = group;

      // duplication calculation should be case-insensitive
      const nameLower = name.toLocaleLowerCase();

      children.forEach(({ name: childName }) => {
        // duplication calculation should be case-insensitive
        const childNameLower = childName.toLocaleLowerCase();
        if (localPrevSet.has(childNameLower)) {
          duplicatesExist = true;
        }
        localPrevSet.add(childNameLower);
      });

      if (id === UNGROUPED_ID) return localPrevSet; // we don't care about its name, it's internal

      if (group.is_archived) {
        if (localPrevSet.has(nameLower)) {
          duplicatesExist = true;
        }
        localPrevSet.add(nameLower);
        parentIdsSet.add(id);
        return localPrevSet;
      }
      if (parentIdsSet.has(id)) {
        // the group's name is not a duplicate, because it is a placeholder for archive children
        return localPrevSet;
      }

      if (localPrevSet.has(nameLower)) {
        duplicatesExist = true;
      }

      localPrevSet.add(nameLower);
      parentIdsSet.add(id);
      return localPrevSet;
    },
    new Set()
  );
  return { eventNamesSet: reducedSet, duplicatesExist };
};

type GetWasEventEdited = {
  eventTypes: IdToEventTypeMap,
  id: string,
  event: CustomEventTypeIP,
};

const getWasEventEdited = ({
  eventTypes,
  id,
  event,
}: GetWasEventEdited): {
  wasEventUpdated: boolean,
  fieldsToUpdate?: { name?: string, squads?: Array<number>, colour?: string },
} => {
  const currentEvent = eventTypes.get(id);
  if (currentEvent) {
    const {
      squads: currentSquads,
      name: currentName,
      colour: currentColour,
      shared: currentShared,
    } = currentEvent;
    const fieldsToUpdate: {
      name?: string,
      squads?: Array<number>,
      colour?: string,
      shared?: boolean,
    } = {};
    if (currentName !== event.name) {
      fieldsToUpdate.name = event.name;
    }
    if (window.featureFlags['squad-scoped-custom-events']) {
      const currentSquadIdsSet = new Set(currentSquads);
      const newEventSquadIdsSet = new Set(event.squads);
      if (!isEqual(currentSquadIdsSet, newEventSquadIdsSet)) {
        fieldsToUpdate.squads = [...newEventSquadIdsSet];
      }
    }
    if (event.colour && currentColour !== event.colour) {
      fieldsToUpdate.colour = event.colour;
    }

    if (event.shared !== currentShared) {
      fieldsToUpdate.shared = event.shared;
    }

    if (Object.keys(fieldsToUpdate).length > 0) {
      return { wasEventUpdated: true, fieldsToUpdate };
    }
  }
  return { wasEventUpdated: false };
};

const createNewGroupEntry = ({
  children,
  name: groupName,
  squads: groupSquads,
}: GroupedEventTypes) => {
  const childrenEvents: Array<NewCustomEventType> = children.map(
    ({ name, squads }) => {
      const eventDataToReturn = {
        name,
        parent_custom_event_type_id: null,
        is_selectable: true,
        squads: [],
      };
      if (window.featureFlags['squad-scoped-custom-events']) {
        eventDataToReturn.squads = squads;
      }
      return eventDataToReturn;
    }
  );
  const groupDataToReturn = {
    name: groupName,
    children: childrenEvents,
    is_selectable: false,
    parent_custom_event_type_id: null,
    squads: [],
  };
  if (window.featureFlags['squad-scoped-custom-events']) {
    groupDataToReturn.squads = groupSquads;
  }
  return groupDataToReturn;
};

type HandleSingleGroup = {
  eventTypes: IdToEventTypeMap,
  groupId: string,
  childEvents:
    | Array<$Exact<CustomEventTypeIP | NewCustomEvent>>
    | Array<NewCustomEvent>
    | Array<CustomEventTypeIP>,
};

const handleSingleGroupChildren = ({
  eventTypes,
  childEvents,
  groupId,
}: HandleSingleGroup) => {
  const newEvents: Array<NewCustomEventType> = [];
  const updatedEvents: Array<CustomEventTypeIP> = [];
  childEvents.forEach((event) => {
    if (event.id.includes(NEW_EVENT_ID_PREFIX)) {
      const newEventToPush = {
        name: event.name,
        is_selectable: true,
        parent_custom_event_type_id: groupId === UNGROUPED_ID ? null : +groupId,
        squads: [],
        colour: event.colour,
      };
      if (window.featureFlags['squad-scoped-custom-events']) {
        newEventToPush.squads = event.squads;
      }

      newEvents.push(newEventToPush);
    } else {
      const { fieldsToUpdate, wasEventUpdated } = getWasEventEdited({
        id: event.id,
        // $FlowIgnore(prop-missing) complains that event might be new, but this can't be in this phase
        event,
        eventTypes,
      });
      if (wasEventUpdated) {
        const squads: Array<number> = fieldsToUpdate?.squads ?? event.squads;
        const name = fieldsToUpdate?.name ?? event.name;
        // $FlowIgnore (cannot-spread-inexact) - this is typed well.
        updatedEvents.push({
          // $FlowIgnore (exponential-spread) - complains that event might be new, but this can't be in this phase
          ...event,
          squads,
          name,
        });
      }
    }
  });
  return { newEvents, updatedEvents };
};

type GetNewAndUpdatedEvents = {
  formData: GroupedEventTypesArray,
  eventTypes: IdToEventTypeMap,
};

export const getNewAndUpdatedEvents = ({
  formData,
  eventTypes,
}: GetNewAndUpdatedEvents) => {
  let newEvents: Array<NewCustomEventType> = [];
  let updatedEvents: Array<CustomEventTypeIP> = [];
  let newGroups: Array<
    NewCustomEventType & {
      children: Array<NewCustomEventType>,
    }
  > = [];
  formData.forEach((group) => {
    const { children, ...restGroup } = group;
    const groupId = group.id;
    if (groupId.includes(NEW_GROUP_ID_PREFIX)) {
      // new group
      // $FlowIgnore(prop-missing) complains that group might be of Ungrouped type, but this can't be in this phase
      newGroups = newGroups.concat(createNewGroupEntry(group));
    }
    // ungrouped
    else if (groupId === UNGROUPED_ID) {
      const groupProcessedEvents = handleSingleGroupChildren({
        groupId,
        childEvents: group.children,
        eventTypes,
      });
      newEvents = newEvents.concat(groupProcessedEvents.newEvents);
      updatedEvents = updatedEvents.concat(groupProcessedEvents.updatedEvents);
    }
    // existing groups
    else {
      // $FlowIgnore(prop-missing) complains that group is missing properties it cannot miss at this point, by the if-else conditions
      const restGroupCast: CustomEventTypeIP = { ...restGroup };
      const { wasEventUpdated, fieldsToUpdate } = getWasEventEdited({
        id: groupId,
        event: restGroupCast,
        eventTypes,
      });
      if (wasEventUpdated) {
        const squads: Array<number> = fieldsToUpdate?.squads ?? group.squads;
        const name = fieldsToUpdate?.name ?? group.name;
        const colour = fieldsToUpdate?.colour ?? group?.colour ?? '';
        updatedEvents.push({
          ...restGroupCast,
          squads,
          name,
          colour,
        });
      }
      const groupProcessedEvents = handleSingleGroupChildren({
        groupId,
        childEvents: children,
        eventTypes,
      });
      newEvents = newEvents.concat(groupProcessedEvents.newEvents);
      updatedEvents = updatedEvents.concat(groupProcessedEvents.updatedEvents);
    }
  });
  return { newEvents, updatedEvents, newGroups };
};
