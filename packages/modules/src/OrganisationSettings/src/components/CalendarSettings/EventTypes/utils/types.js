// @flow
import type { SetState } from '@kitman/common/src/types/react';
import type { CustomEventTypeIP } from '@kitman/services/src/services/OrganisationSettings/CalendarSettings/EventTypes/utils/types';
import { UNGROUPED_ID } from './consts';

export type GroupRowAction = (groupIndex: number) => Promise<void>;

export type EventRowAction = (id: string) => Promise<void>;

export type SelectedEventTypes = $Exact<{
  selectedEventTypes: Set<string>,
  setSelectedEventTypes: SetState<Set<string>>,
}>;

export type NewCustomEvent = $Exact<{
  id: string,
  squads: Array<number>,
  name: string,
  colour?: string,
  is_archived: boolean,
  is_selectable: boolean,
}>;

export type GroupedEventTypes = $Exact<{
  children: Array<$Exact<CustomEventTypeIP | NewCustomEvent>>,
  ...CustomEventTypeIP,
}>;

export type NewGroup = $Exact<{
  id: string,
  squads: Array<number>,
  name: string,
  children: Array<NewCustomEvent>,
  colour?: string,
  shared?: boolean,
}>;

export type UngroupedEventTypes = $Exact<{
  id: typeof UNGROUPED_ID,
  children:
    | Array<$Exact<CustomEventTypeIP | NewCustomEvent>>
    | Array<$Exact<CustomEventTypeIP>>,
  name: string,
  colour?: string,
  squads: Array<number>,
  is_archived: boolean,
  is_selectable: boolean,
  shared?: boolean,
}>;

export type UngroupedArchivedEventTypes = $Exact<{
  id: string,
  children: Array<CustomEventTypeIP>,
  name: string,
  colour?: string,
  squads: Array<number>,
  is_archived: boolean,
  is_selectable: boolean,
}>;

export type GroupedEventTypesArray = Array<
  $Exact<GroupedEventTypes | UngroupedEventTypes | NewGroup>
>;

export type GroupedArchivedEventTypesArray = Array<
  $Exact<GroupedEventTypes | UngroupedArchivedEventTypes>
>;

export type IdToGroupedEventTypesMap = Map<string, GroupedEventTypes>;

export type IdToEventTypeMap = Map<string, CustomEventTypeIP>;

export type SquadIdToNameMap = Map<number, string>;
