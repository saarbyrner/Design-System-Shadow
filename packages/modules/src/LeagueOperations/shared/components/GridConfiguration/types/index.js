// @flow
import type { Node } from 'react';
import type { Squad as BasicSquad } from '@kitman/common/src/types/Squad';
import type {
  RegistrationStatus,
  MultiRegistration,
  Squad,
  UserType,
  RegistrationSystemStatus,
  RegistrationStatusReason,
  HomegrownDocument,
} from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type {
  DisciplinaryStatus,
  DisciplineActiveIssue,
} from '../../../types/discipline';

export type AvatarCell = {
  id: number,
  text: string,
  avatar_src: string,
  href?: string,
};

export type TeamCell = {
  id: number,
  text: string,
};

export type AddressCell = Array<string>;

export type LinkedCell = {
  text: string | number,
  href: ?string,
};

export type ActionCell = {
  text: string,
  isActionable: boolean,
};

export type OrganisationRow = {
  id: number,
  organisations: Array<AvatarCell>,
  total_squads: number,
  total_staff: number,
  total_athletes: number,
  address: AddressCell,
  amount_paid: number | string,
  wallet: number | string,
};

export type SquadRow = {
  id: number,
  name: LinkedCell,
  total_coaches: number,
  total_athletes: number,
};

export type MultiSquadRow = {
  id: number,
  team: LinkedCell,
};

export type AthleteRow = {
  id: number,
  athlete: Array<AvatarCell>,
  date_of_birth: string,
  organisations: Array<AvatarCell>,
  team?: TeamCell,
  leagues?: string,
  squads?: Array<Squad>,
  non_registered: boolean,
  registration_status?: RegistrationStatus,
  registration_system_status: ?RegistrationSystemStatus,
  registration_status_reason: ?RegistrationStatusReason,
  registrations?: Array<MultiRegistration>,
  address?: AddressCell,
};

export type UserRow = {
  id: number,
  user: Array<AvatarCell>,
  date_of_birth: string,
  organisations: Array<AvatarCell>,
  address: AddressCell,
  registration_status?: RegistrationStatus,
  registration_system_status: ?RegistrationSystemStatus,
  registration_status_reason: ?RegistrationStatusReason,
  registrations?: Array<MultiRegistration>,
  non_registered?: boolean,
  title: string,
};

export type MultiRegistrationRow = {
  id: number | string,
  leagues: string,
  position: string,
  registration_status: RegistrationStatus,
};

export type GridKeys =
  | 'association'
  | 'organisation'
  | 'squad'
  | 'athlete'
  | 'staff'
  | 'organisation_athlete'
  | 'organisation_staff'
  | 'registration'
  | 'athlete_squad'
  | 'athlete_registration'
  | 'staff_registration'
  | 'roster_history'
  | 'requirements'
  | 'athlete_discipline'
  | 'user_discipline'
  | 'homegrown'
  | 'suspension_details';

export type OrgKey = 'MLS_NEXT_PRO' | 'MLS_NEXT' | 'MLS';

export type GridParams = {
  key: GridKeys,
  userType: UserType,
  orgKey: OrgKey,
};

export type Registrations = {
  id: number,
  status: RegistrationStatus,
  user_id: number,
  user: {
    id: number,
    firstname: string,
    lastname: string,
    squads?: Array<BasicSquad>,
  },
  athlete?: {
    id: number,
    squad_numbers: [],
    position: {
      id: number,
      name: string,
    },
  },
  registration_requirement: {
    id: number,
    active: boolean,
  },
  registration_system_status: RegistrationSystemStatus,
  division: {
    id: number,
    name: string,
  },
};

export type RegistrationRows = {
  id: number | string,
  league: { text: string, href: string },
  jersey_no?: Array<string> | string,
  position?: string,
  type?: Node,
  title?: string,
  registration_status?: RegistrationStatus,
  squads?: Array<Squad>,
  club?: Array<AvatarCell>,
};

export type RosterHistoryRows = {
  id: number,
  league?: string,
  club: Array<AvatarCell>,
  squad: string,
  joined: string,
  left?: string,
};

export type RequirementSectionRow = {
  id: number,
  requirement: ActionCell,
  registration_status: RegistrationStatus,
  registration_system_status: ?RegistrationSystemStatus,
};

export type UserDisciplineRow = {
  id: number,
  athlete: Array<AvatarCell>,
  organisations: Array<AvatarCell>,
  team?: string,
  red_cards: number,
  yellow_cards: number,
  total_suspensions: number,
  suspended_until: string,
  discipline_status: DisciplinaryStatus,
  active_discipline: DisciplineActiveIssue,
  squads?: Array<{ id: number, name: string }>,
};

export type AthleteDisciplineRow = UserDisciplineRow & {
  jersey_no?: string | number,
};

export type HomegrownRow = {
  id: number,
  title: string,
  date_submitted: string,
  submitted_by: string,
  certified_by: string,
  documents: Array<HomegrownDocument>,
};

export type SuspensionDetailsRows = {
  duration: string,
  reason: string,
  competition: Node,
  notes: ?string,
};
