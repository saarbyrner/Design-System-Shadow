// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AvailabilityStatus } from '@kitman/common/src/types/Athlete';

export type AthleteAvailabilityRecord = {
  athlete_id: number,
  availability_status: AvailabilityStatus,
  days: ?number,
  processing_in_progress: boolean,
};

export type GetAthletesAvailabilitiesResponse =
  Array<AthleteAvailabilityRecord>;

export const endpoint = '/emr/availabilities/athletes_statuses';

export default async function getAthletesAvailabilities(
  athleteIds: Array<number>
): Promise<GetAthletesAvailabilitiesResponse> {
  const { data } = await axios.post(endpoint, {
    athlete_ids: athleteIds,
  });

  return data;
}
