// @flow

import type {
  DropdownItem,
  GroupedDropdownItem,
} from '@kitman/components/src/types';

export type TrainingSession = {
  eventType: 'TRAINING_SESSION',
  id?: ?number,
  date: string,
  sessionTypeId: string,
  workloadType: string,
  duration: string,
  localTimezone: string,
  gameDays?: Array<string>,
  surfaceType: ?string,
  surfaceQuality: ?string,
  weather: ?string,
  temperature: ?string,
};

export type TrainingSessionFormData = {
  loaded: boolean,
  sessionTypes: Array<DropdownItem>,
  workloadTypes: Array<DropdownItem>,
  surfaceTypes: Array<GroupedDropdownItem>,
  surfaceQualities: Array<DropdownItem>,
  weathers: Array<DropdownItem>,
  temperatureUnit: 'F' | 'C',
};
