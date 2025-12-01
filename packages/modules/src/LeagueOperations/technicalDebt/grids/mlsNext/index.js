// @flow
import type { UserType } from '@kitman/modules/src/LeagueOperations/shared/types/common';
import type { GridColDef } from '@mui/x-data-grid-pro';
import type { GridKeys } from '@kitman/modules/src/LeagueOperations/shared/components/GridConfiguration/types';

import {
  ASSOCIATION_ATHLETES,
  ASSOCIATION_ORGANISATIONS,
  ASSOCIATION_SQUADS,
  ASSOCIATION_ORGANISATION_ATHLETES,
  ASSOCIATION_STAFF,
  ASSOCIATION_ORGANISATION_STAFF,
  ATHLETE_SQUADS,
  ATHLETE_REGISTRATION,
  STAFF_REGISTRATION,
  ASSOCIATION_ORGANISATION_ROSTER_HISTORY,
  REQUIREMENTS,
  DISCIPLINE_ATHLETE,
  DISCIPLINE_USER,
  ORGANISATION_ATHLETES,
  ORGANISATION_STAFF,
  ORGANISATION_SQUADS,
  ORGANISATION_ROSTER_HISTORY,
  HOMEGROWN,
  SUSPENSION_DETAILS,
} from './columnDefinitions';

const MLS_NEXT_GRIDS: {
  [key: UserType]: { [key: GridKeys]: Array<GridColDef> },
} = {
  association_admin: {
    organisation: ASSOCIATION_ORGANISATIONS,
    squad: ASSOCIATION_SQUADS,
    athlete: ASSOCIATION_ATHLETES,
    organisation_athlete: ASSOCIATION_ORGANISATION_ATHLETES,
    staff: ASSOCIATION_STAFF,
    organisation_staff: ASSOCIATION_ORGANISATION_STAFF,
    athlete_squad: ATHLETE_SQUADS,
    athlete_registration: ATHLETE_REGISTRATION,
    staff_registration: STAFF_REGISTRATION,
    roster_history: ASSOCIATION_ORGANISATION_ROSTER_HISTORY,
    requirements: REQUIREMENTS,
    athlete_discipline: DISCIPLINE_ATHLETE,
    user_discipline: DISCIPLINE_USER,
    homegrown: HOMEGROWN,
    suspension_details: SUSPENSION_DETAILS,
  },
  organisation_admin: {
    athlete: ORGANISATION_ATHLETES,
    staff: ORGANISATION_STAFF,
    squad: ORGANISATION_SQUADS,
    athlete_squad: ATHLETE_SQUADS,
    athlete_registration: ATHLETE_REGISTRATION,
    staff_registration: STAFF_REGISTRATION,
    roster_history: ORGANISATION_ROSTER_HISTORY,
    requirements: REQUIREMENTS,
    athlete_discipline: DISCIPLINE_ATHLETE,
    user_discipline: DISCIPLINE_USER,
    homegrown: HOMEGROWN,
    suspension_details: SUSPENSION_DETAILS,
  },
  athlete: {
    athlete_registration: ATHLETE_REGISTRATION,
    squad: ATHLETE_SQUADS,
    requirements: REQUIREMENTS,
  },
  staff: {
    staff_registration: STAFF_REGISTRATION,
    squad: ATHLETE_SQUADS,
    requirements: REQUIREMENTS,
  },
};

export default MLS_NEXT_GRIDS;
