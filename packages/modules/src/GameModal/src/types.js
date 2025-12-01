// @flow

import type {
  DropdownItem,
  GroupedDropdownItem,
} from '@kitman/components/src/types';

export type Fixture = {
  id?: ?string,
  date: string,
  venueTypeId: string,
  venueTypeName: string,
  organisationTeamId: string,
  organisationTeamName: string,
  teamId: string,
  teamName: string,
  competitionId: string,
  competitionName: string,
  roundNumber: string,
  turnaroundPrefix: string,
  createTurnaroundMarker: boolean,
};

export type Game = {
  eventType: 'GAME',
  id?: ?number,
  score: ?string,
  markerId: string,
  opponentScore: ?string,
  localTimezone: string,
  duration: string,
  fixture: Fixture,
  isActive: boolean,
  surfaceType: ?string,
  surfaceQuality: ?string,
  weather: ?string,
  temperature: ?string,
};

export type GameFormData = {
  loaded: boolean,
  fixtures: Array<{
    id: string,
    title: string,
    duration: string,
    fixture?: Fixture,
  }>,
  venueTypes: Array<DropdownItem>,
  organisationTeams: Array<DropdownItem>,
  teams: Array<DropdownItem>,
  competitions: Array<DropdownItem>,
  surfaceTypes: Array<GroupedDropdownItem>,
  surfaceQualities: Array<DropdownItem>,
  weathers: Array<DropdownItem>,
  temperatureUnit: 'F' | 'C',
};
