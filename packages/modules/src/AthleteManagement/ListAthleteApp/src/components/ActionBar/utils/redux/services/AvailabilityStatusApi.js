// @flow
import { axios } from '@kitman/common/src/utils/services';

export type AvailabilityStatusesResponse = Array<string>;

export const getAllAvailabilityStatusesEndpoint =
  '/profile_variables/athlete_game_status/permitted_values';

export const getAllAvailabilityStatuses =
  async (): Promise<AvailabilityStatusesResponse> => {
    const { data } = await axios.get(getAllAvailabilityStatusesEndpoint);
    return data;
  };

type AthleteValues = {
  athlete_id: number,
  value: string,
};
type AthleteProfileVars = {
  perma_id: string,
  athlete_values: Array<AthleteValues>,
};
export type BulkUpdatePayload = {
  athlete_profile_variables: Array<AthleteProfileVars>,
};

export const availabilityStatusUpdateURL =
  '/planning_hub/athlete_game_status/bulk_save';
export const bulkUpdateAthleteAvailabilityStatus = async (
  bulkUpdateObject: BulkUpdatePayload
): Promise<void> => {
  await axios.post(availabilityStatusUpdateURL, bulkUpdateObject);
};
