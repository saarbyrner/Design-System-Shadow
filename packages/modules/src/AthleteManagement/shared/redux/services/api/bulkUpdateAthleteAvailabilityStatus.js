// @flow
import { axios } from '@kitman/common/src/utils/services';

export const BULK_UPDATE_AVAILABILITY_STATUS_ENDPOINT =
  '/planning_hub/athlete_game_status/bulk_save';

type AthleteValues = {
  athlete_id: number,
  value: string,
};
type AthleteProfileVars = {
  perma_id: string,
  athlete_values: Array<AthleteValues>,
};
export type BulkUpdateAthletesStatusRequestBody = {
  athlete_profile_variables: Array<AthleteProfileVars>,
};

export type BulkUpdateActiveStatusReturnType = {};

export const bulkUpdateAthleteAvailabilityStatus = async (
  requestBody: BulkUpdateAthletesStatusRequestBody
): Promise<BulkUpdateActiveStatusReturnType> => {
  const { data } = await axios.post(
    BULK_UPDATE_AVAILABILITY_STATUS_ENDPOINT,
    requestBody
  );
  return data;
};
