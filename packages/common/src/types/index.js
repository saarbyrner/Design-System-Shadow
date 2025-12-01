// @flow
import type { PlatformType } from './__common';
import type { Athlete } from './Athlete';
import type { Status } from './Status';

export type RequestStatus = 'PENDING' | 'SUCCESS' | 'FAILURE' | null;

export type Dispatch<T> = (action: T) => any;

export type ModalStatus =
  | 'success'
  | 'error'
  | 'loading'
  | 'confirm'
  | 'confirmWithTitle'
  | 'message'
  | 'warning'
  | null;
export type GroupBy =
  | 'availability'
  | 'position'
  | 'positionGroup'
  | 'last_screening'
  | 'name';
export type SortOrder = 'high_to_low' | 'low_to_high' | null;

export type StatusVariable = {
  source_key: string,
  name: string,
  source_name: string,
  type: $PropertyType<Status, 'type'>,
  localised_unit: string,
  is_protected?: boolean,
};

export type QuestionnaireVariable = {
  id: string,
  key: PlatformType,
  name: string,
};

export type Template = {
  id: number | string,
  name: string,
  last_edited_at: string,
  last_edited_by: string,
  active: boolean,
  platforms: Array<string>,
  mass_input: boolean,
  show_warning_message: boolean,
};

export type Dashboard = {
  id: number | string,
  name: string,
  created_at: string,
  last_update_by: number | string,
  organisation_id: number | string,
  updated_at: string,
};

export type ActionCreator = {
  type: string,
  payload?: mixed,
};

export type IconButtonTheme = 'default' | 'destruct';

export type LinkTarget = '_self' | '_blank';

export type RadioOption = {
  value: string | number | boolean,
  name: string,
};

export type Validation = {
  isValid: boolean,
  value?: string,
  type?: string,
  message?: string,
};

// states
export type DialoguesState = { [string]: boolean };

export type CoachingPrinciplesState = { [string]: boolean };

// actions
export type ShowDialogueAction = {
  type: 'SHOW_DIALOGUE',
  payload: { dialogue: string },
};

export type HideDialogueAction = {
  type: 'HIDE_DIALOGUE',
};

export type SetGroupByAction = {
  type: 'SET_GROUP_BY',
  payload: {
    groupBy: GroupBy,
  },
};

export type SetNameFilterAction = {
  type: 'SET_NAME_FILTER',
  payload: {
    value: string,
  },
};

export type ClearNameFilterAction = {
  type: 'CLEAR_NAME_FILTER',
};

export type SetAthletesAction = {
  type: 'SET_ATHLETES',
  payload: {
    athletes: Object,
  },
};

export type SetCoachingPrinciplesEnabled = {
  type: 'SET_COACHING_PRINCIPLES_ENABLED',
  payload: { value: boolean },
};

export type MenuItem = {
  label: string,
  url: string,
  isDisabled?: boolean,
};

export type DateRange = {
  start_date: string,
  end_date: string,
};

export type DateRangeMUI = {
  start: ?string,
  end: ?string,
};

export type AlarmSquadSearch = {
  athletes: Array<Athlete>,
  athleteOrder: Array<number>,
  positions: Array<string>,
  positionOrder: Array<number>,
  positionGroups: Array<string>,
  positionGroupOrder: Array<number>,
};

export type AlarmSquadSearchSelection = {
  athletes: Array<Athlete>,
  positions: Array<string>,
  position_groups: Array<string>,
  applies_to_squad: boolean,
};
