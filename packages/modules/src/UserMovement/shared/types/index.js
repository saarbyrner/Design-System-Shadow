// @flow

import type { UserMovementDrawerState } from '@kitman/modules/src/UserMovement/shared/redux/slices/userMovementDrawerSlice';
import type { LabelsResponse } from '@kitman/services/src/services/OrganisationSettings/DynamicCohorts/Labels/getAllLabels';

import type { MovementHistoryState } from '../redux/slices/movementHistorySlice';
import type { MovementProfileState } from '../redux/slices/movementProfileSlice';

export type ValidationStatus = 'PENDING' | 'INVALID' | 'VALID';
export type MovementType =
  | 'medical_trial'
  | 'medical_trial_v2'
  | 'trade'
  | 'release'
  | 'loan'
  | 'retire'
  | 'trial'
  | 'multi_assign';

export type ValidationState = {
  [key: string]: {
    status: ValidationStatus,
    message: ?string,
  },
};
export type FormState = {
  user_id: ?string,
  transfer_type: ?MovementType,
  join_organisation_ids: Array<number>,
  join_squad_ids: Array<number>,
  leave_organisation_ids: Array<number>,
  joined_at: string,
};

export type ElementOpenState = {
  isOpen: boolean,
};

export type CreateMovementState = {
  drawer: ElementOpenState,
  modal: ElementOpenState,
  form: FormState,
  validation: ValidationState,
};

export type Mode = 'EDIT' | 'VIEW';

export type Store = {
  userMovementDrawerState: UserMovementDrawerState,
  'UserMovement.slice.history': MovementHistoryState,
  'UserMovement.slice.createMovement': CreateMovementState,
  'UserMovement.slice.profile': MovementProfileState,
};

export type Meta = {
  current_page: number,
  next_page: ?number,
  prev_page: ?number,
  total_count: number,
  total_pages: number,
};

export type MovementOrganisation = {
  id: number,
  name: string,
  logo_full_path: string,
  unassigned_org_name?: ?string,
};

// TODO: Update once model defined
export type SearchAthleteProfile = {
  access_locked: boolean,
  avatar: string,
  created: string,
  date_of_birth: string,
  email: string,
  id: number,
  name: string,
  organisations: Array<MovementOrganisation>,
  position: string,
  squads: string,
  updated: string,
  user_id: number,
  username: string,
  labels: LabelsResponse,
  athlete_game_status: ?string,
};

export type MovementModulePermissions = {
  medicalTrial: boolean,
  release: boolean,
  trade: boolean,
  viewHistory: boolean,
};

export type MovementPermissions = {
  player: MovementModulePermissions,
};
