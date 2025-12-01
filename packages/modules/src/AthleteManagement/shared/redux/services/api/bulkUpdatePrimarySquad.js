// @flow
import { axios } from '@kitman/common/src/utils/services';

export const BULK_UPDATE_PRIMARY_SQUAD_ENDPOINT =
  '/administration/bulk_update_primary_squads';

export type BulkUpdatePrimarySquadRequestBody = {
  athlete_ids: Array<number>,
  primary_squad_id: number | null,
};

export type BulkUpdatePrimarySquadReturnType = {};

export const bulkUpdatePrimarySquad = async (
  requestBody: BulkUpdatePrimarySquadRequestBody
): Promise<BulkUpdatePrimarySquadReturnType> => {
  const { data } = await axios.put(
    BULK_UPDATE_PRIMARY_SQUAD_ENDPOINT,
    requestBody
  );

  return data;
};
