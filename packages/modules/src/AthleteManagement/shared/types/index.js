// @flow

import type { AthleteManagementState } from '../redux/slices/athleteManagementSlice';

export type Store = {
  athleteManagementSlice: AthleteManagementState,
};

export type CareerStatus = 'ACTIVE' | 'RETIRED' | 'RELEASED';

export type ActiveStatus = 'ACTIVE' | 'INACTIVE';
