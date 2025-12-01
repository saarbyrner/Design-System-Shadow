// @flow
import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { GridColDef } from '@mui/x-data-grid-pro';
import type { GridKeys } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';
import {
  NEXT_PRO_ASSOCIATION_ORGANISATIONS,
  NEXT_PRO_ASSOCIATION_STAFF,
  NEXT_PRO_ATHLETE_REGISTRATION,
  NEXT_PRO_ORGANISATION_ATHLETES,
  NEXT_PRO_ORGANISATION_STAFF,
  NEXT_PRO_STAFF_REGISTRATION,
  NEXT_PRO_ASSOCIATION_ATHLETES,
} from './columnDefinitions';

import {
  ASSOCIATION_SQUADS,
  ASSOCIATION_ORGANISATION_ATHLETES,
  ASSOCIATION_ORGANISATION_STAFF,
  ATHLETE_SQUADS,
  ASSOCIATION_ORGANISATION_ROSTER_HISTORY,
  REQUIREMENTS,
  DISCIPLINE_ATHLETE,
  DISCIPLINE_USER,
  ORGANISATION_SQUADS,
  ORGANISATION_ROSTER_HISTORY,
  SUSPENSION_DETAILS,
} from '../mlsNext/columnDefinitions';

const MLS_NEXT_PRO_GRIDS: {
  [key: UserType]: { [key: GridKeys]: Array<GridColDef> },
} = {
  association_admin: {
    organisation: NEXT_PRO_ASSOCIATION_ORGANISATIONS,
    squad: ASSOCIATION_SQUADS,
    athlete: NEXT_PRO_ASSOCIATION_ATHLETES,
    organisation_athlete: ASSOCIATION_ORGANISATION_ATHLETES,
    staff: NEXT_PRO_ASSOCIATION_STAFF,
    organisation_staff: ASSOCIATION_ORGANISATION_STAFF,
    athlete_squad: ATHLETE_SQUADS,
    athlete_registration: NEXT_PRO_ATHLETE_REGISTRATION,
    staff_registration: NEXT_PRO_STAFF_REGISTRATION,
    roster_history: ASSOCIATION_ORGANISATION_ROSTER_HISTORY,
    requirements: REQUIREMENTS,
    athlete_discipline: DISCIPLINE_ATHLETE,
    user_discipline: DISCIPLINE_USER,
    suspension_details: SUSPENSION_DETAILS,
  },
  organisation_admin: {
    athlete: NEXT_PRO_ORGANISATION_ATHLETES,
    staff: NEXT_PRO_ORGANISATION_STAFF,
    squad: ORGANISATION_SQUADS,
    athlete_squad: ATHLETE_SQUADS,
    athlete_registration: NEXT_PRO_ATHLETE_REGISTRATION,
    staff_registration: NEXT_PRO_STAFF_REGISTRATION,
    roster_history: ORGANISATION_ROSTER_HISTORY,
    requirements: REQUIREMENTS,
    athlete_discipline: DISCIPLINE_ATHLETE,
    user_discipline: DISCIPLINE_USER,
    suspension_details: SUSPENSION_DETAILS,
  },
  athlete: {
    athlete_registration: NEXT_PRO_ATHLETE_REGISTRATION,
    squad: ATHLETE_SQUADS,
    requirements: REQUIREMENTS,
  },
  staff: {
    staff_registration: NEXT_PRO_STAFF_REGISTRATION,
    squad: ATHLETE_SQUADS,
    requirements: REQUIREMENTS,
  },
};

export default MLS_NEXT_PRO_GRIDS;
