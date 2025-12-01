// @flow
import type {
  EventLocation,
  EventLocationFull,
} from '@kitman/services/src/services/planning/getEventLocations';
import type { CustomEventTypeFull } from '@kitman/services/src/services/planning/getCustomEventTypes';

// Given a parent location, and an array of locations who are associated with that location, build the hyphenated label
export const buildParentLabel = (
  parentLocation: EventLocation,
  childLocations: Array<EventLocation>
): string => {
  let label = '';

  // finding the parent's child
  const child = childLocations.find(
    (parent) => parentLocation.id === parent.parent_event_location_id
  );

  // if the parent has a child
  if (child) {
    // add that child's name
    label += `${child.name} - `;
    const anotherLevel = childLocations.find(
      (parent) => child.id === parent.parent_event_location_id
    );
    if (anotherLevel) {
      label += buildParentLabel(
        child,
        childLocations.filter((parent) => parent.id !== parentLocation.id)
      );
    }
  }

  return label;
};

// Build a label for a given object that includes the ancestors in a hyphenated list
export const buildParentsLabel = (
  childObject: EventLocationFull | CustomEventTypeFull,
  excludeName?: boolean
) => {
  let label = '';
  for (let i = childObject.parents?.length - 1; i >= 0; i--) {
    if (i === 0 && excludeName) {
      label += `${childObject.parents[i].name}`;
    } else {
      label += `${childObject.parents[i].name} - `;
    }
  }

  return excludeName ? label : `${label}${childObject.name}`;
};

export const getTopLevelLocations = (
  locations: Array<EventLocationFull>
): Array<EventLocationFull> => {
  return locations?.filter((location) => {
    return location.parent_event_location_id == null;
  });
};
