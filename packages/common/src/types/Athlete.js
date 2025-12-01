// @flow
import type { ShortLabelResponse } from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/createLabel';
import type { Alarm } from './Alarm';
import type { Squad } from './Squad';

export type AthleteBasic = {
  id: number,
  fullname: string,
  position: string,
  avatar_url: string,
};

export type MovedAthlete = {
  id: number,
  firstname: string,
  lastname: string,
};

export type AvailabilityStatus =
  | 'available'
  | 'unavailable'
  | 'injured'
  | 'returning'
  | 'absent'
  | 'ill';

export type AthleteOrganisation = {
  id: number,
  name: string,
  free_agent: boolean,
};

export type Athlete = {
  ...AthleteBasic,
  id: any, // Override AthleteBasic id type as needs better typing throughout system
  firstname: string,
  lastname: string,
  shortname: string,
  availability: AvailabilityStatus,
  last_screening: string,
  status_data: {
    [string]: {
      data_points_used: number,
      alarms: Array<Alarm>,
      value: ?number | ?string,
    },
  },
  positionId: any,
  positionGroup: string,
  positionGroupId: any,
  variable_ids?: Array<string>,
  squad_ids?: Array<number>,
  indications?: ?Object,
  on_dashboard?: boolean,
  comment?: string,
  screened_today?: boolean,
  modification_info?: string,
  organisations?: Array<AthleteOrganisation>,
};

export type AdministrationAthleteMeta = {
  current_page: number,
  next_page: ?number,
  prev_page: ?number,
  total_count: number,
  total_pages: number,
};

export type AdministrationAthlete = {
  id: number,
  name: string,
  email: string,
  username: string,
  avatar: string,
  position: string,
  squads: string,
  created: string,
  updated: string,
  labels: Array<ShortLabelResponse>,
};

export type AdministrationAthleteData = {
  meta: AdministrationAthleteMeta,
  athletes: AdministrationAthlete[],
};

export type AthletePolicy = {
  athlete_squads: Squad[],
  created_at: string,
  fullname: string,
  policies: any[],
  position: string,
  username: string,
};
