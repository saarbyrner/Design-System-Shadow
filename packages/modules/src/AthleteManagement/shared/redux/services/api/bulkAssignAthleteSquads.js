// @flow
import { axios } from '@kitman/common/src/utils/services';

export const BULK_ASSIGN_ATHLETE_SQUADS_ENDPOINT =
  '/administration/bulk_assign_athlete_squads';

type SquadAssign = {
  athlete_id: number,
  squad_ids: Array<number>,
};

export type BulkAssignAthleteSquadsRequestBody = {
  athletes: Array<SquadAssign>,
};

export type BulkAssignAthleteSquadsReturnType = {}; // for now

export const bulkAssignAthleteSquads = async (
  requestBody: BulkAssignAthleteSquadsRequestBody
): Promise<BulkAssignAthleteSquadsReturnType> => {
  const { data } = await axios.put(
    BULK_ASSIGN_ATHLETE_SQUADS_ENDPOINT,
    requestBody
  );

  return data;
};
