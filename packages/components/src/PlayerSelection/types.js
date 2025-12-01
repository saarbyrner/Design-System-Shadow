// @flow
import type { PositionGroup } from '../AthleteSelector/types';

export type StaffMemberData = {
  // Ruby attribute naming convention
  id: string,
  firstname: string,
  lastname: string,
  username: string,
};

export type SquadData = {
  id: string,
  name: string,
  position_groups: Array<PositionGroup>,
};

export type AthletesAndStaffSelection = {
  athletes: Array<string>,
  staff: Array<string>,
};
