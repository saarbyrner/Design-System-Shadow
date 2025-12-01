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
  id: number,
  name: string,
  position_groups: Array<PositionGroup>,
};

export type AthleteSelectionWithOptionalAdditionalData =
  | { id: string, additionalData: { firstname: string, lastname: string } }
  | string;

export type AthletesAndStaffSelection = {
  athletes: Array<AthleteSelectionWithOptionalAdditionalData>,
  staff: Array<string>,
};
