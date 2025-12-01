// @flow

import 'core-js/stable/structured-clone';
import { partition, groupBy } from 'lodash';

import { type CustomEventTypeFull } from '@kitman/services/src/services/planning/getCustomEventTypes';
import type {
  SquadAthlete,
  SquadAthletes,
} from '@kitman/components/src/Athletes/types';
import type { SquadData } from '@kitman/components/src/AthleteAndStaffSelector/types';
import { type Squad } from '@kitman/services/src/services/getSquads';
import { buildParentsLabel } from '../common/LocationSelect/utils';

export type EventTypeOption = $Exact<{
  value: number,
  label: string,
  squads?: Array<Squad>,
  shared?: boolean,
}>;

export type EventTypeParent = $Exact<{
  label: string,
  squads?: Array<Squad>,
  options?: Array<EventTypeOption>,
}>;

export type AllEventTypeOptions = Array<EventTypeParent | EventTypeOption>;

export const mapParentChildEventTypes = (
  eventTypes: Array<CustomEventTypeFull>
): Array<EventTypeParent> => {
  // group by the parent labels
  const groupedByParentEventTypes = groupBy(eventTypes, (item) => {
    return item.parentLabel;
  });

  const groupedOptions = Object.keys(groupedByParentEventTypes)?.map(
    (groupedEventTypeKey) => {
      const isSharedEventsEnabled = window.getFlag('shared-custom-events');
      const isSquadScopedCustomEventsEnabled = window.getFlag(
        'squad-scoped-custom-events'
      );

      const options = groupedByParentEventTypes[groupedEventTypeKey]?.map(
        (eventType) => {
          const isShared =
            eventType.shared ||
            eventType.parents?.some((parent) => parent.shared);

          return {
            value: eventType.id,
            label: eventType.name,
            ...(isSquadScopedCustomEventsEnabled && {
              squads: eventType.squads,
            }),
            ...(isSharedEventsEnabled && {
              shared: isShared,
            }),
          };
        }
      );

      // nest the child options underneath their parent label
      return {
        label: groupedEventTypeKey,
        options,
      };
    }
  );

  return groupedOptions;
};

export const excludeAttendees = (
  visibilitySelection: Array<number>,
  attendeeSelection?: Array<number>
): Array<number> => {
  return visibilitySelection.filter((visbilityId: number) => {
    return !attendeeSelection?.some((userId: number) => userId === visbilityId);
  });
};

export const athletesExistInSquad = (
  allSquadOption: SquadData | SquadAthlete,
  athleteIds: Array<string | number>
): boolean => {
  // create a Set of athletes in the squad
  const athleteSet = new Set(
    allSquadOption.position_groups
      .map(({ positions }) =>
        positions.map(({ athletes }) => {
          return athletes.map(({ id: athleteId }) => athleteId);
        })
      )
      .flat(2)
  );

  // if any of the selected athletes are in this squad, return true
  return athleteIds.some((athleteId) => {
    return athleteSet.has(athleteId);
  });
};

type FilterSquads = ((
  eventTypeSquads: Array<Squad>,
  allSquads: Array<SquadData>,
  selectedAthleteIds: Array<number | string>
) => Array<SquadData>) &
  ((
    eventTypeSquads: Array<Squad>,
    allSquads: SquadAthletes,
    selectedAthleteIds: Array<number | string>
  ) => SquadAthletes);

export const filterSquads: FilterSquads = (
  eventTypeSquads,
  allSquads,
  selectedAthleteIds
) => {
  const availableSquadIds = new Set(
    eventTypeSquads.map((squadOption) => squadOption.id)
  );
  const filteredSquads = allSquads.filter((allSquadOption) => {
    if (availableSquadIds.has(allSquadOption.id)) {
      return true;
    }

    // ensure current athletes' squads still show up in the dropdown
    const athleteInSquad = athletesExistInSquad(
      allSquadOption,
      selectedAthleteIds
    );
    return athleteInSquad;
  });
  // $FlowIgnore - this function is used with SquadAthletes and SquadData, which are similar types but not exactly the same
  return filteredSquads;
};

export const StaffVisibilityOptions = {
  allStaff: 'allStaff',
  onlySelectedStaff: 'onlySelectedStaff',
  selectedStaffAndAdditional: 'selectedStaffAndAdditional',
};

export type StaffVisibilityEnum = $Keys<typeof StaffVisibilityOptions>;

const alphabeticalSort = (
  options: Array<EventTypeOption>
): Array<EventTypeOption> => {
  return options.sort((a, b) => a.label.localeCompare(b.label));
};

export const mapToEventTypes = (
  customEventTypes: Array<CustomEventTypeFull>
): AllEventTypeOptions => {
  // build the categorization label
  const parentLabelMap = customEventTypes.map((eventType) => ({
    ...eventType,
    parentLabel: buildParentsLabel(eventType, true),
  }));

  const isSharedEventsEnabled = window.getFlag('shared-custom-events');
  const isSquadScopedCustomEventsEnabled = window.getFlag(
    'squad-scoped-custom-events'
  );

  const [groupedEventTypes, ungroupedEventTypes] = partition(
    parentLabelMap,
    'parentLabel'
  );

  const groupedOptions = mapParentChildEventTypes(groupedEventTypes);
  const ungroupedOptions = ungroupedEventTypes.map(
    ({ id, name, squads, shared }) => {
      return {
        value: id,
        label: name,
        ...(isSquadScopedCustomEventsEnabled && {
          squads,
        }),
        ...(isSharedEventsEnabled && {
          shared,
        }),
      };
    }
  );

  // spec noted that ungrouped options should be alphabetical
  return [...groupedOptions, ...alphabeticalSort(ungroupedOptions)];
};
