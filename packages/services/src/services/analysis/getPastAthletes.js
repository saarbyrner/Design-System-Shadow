// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Timescope } from '@kitman/modules/src/analysis/shared/types';

export type PastAthlete = {
  id: number,
  fullname: string,
};

type RequestBody = {
  time_scope: Timescope,
};

export const PAST_ATHLETES_ENDPOINT_URL =
  '/ui/reporting/athletes/past_athletes';

const getPastAthletes = async (
  requestBody: RequestBody
): Promise<Array<PastAthlete>> => {
  const { data } = await axios.post(PAST_ATHLETES_ENDPOINT_URL, requestBody);

  return data;
};

export default getPastAthletes;
