// @flow
import { axios } from '@kitman/common/src/utils/services';

type Params = {
  athlete_id: number | string,
  squad_number?: ?number | ?string,
  rating_id?: number,
  disable_grid: boolean,
};

export default async function updateAthleteAttributes(
  eventId: number | string,
  params: Params
): Promise<{ message: string }> {
  return axios.post(
    `/planning_hub/events/${eventId}/athlete_events/update_attributes`,
    params
  );
}
