// @flow
import { axios } from '@kitman/common/src/utils/services';

export type NonCompliantAthletes = {
  wellbeing: Array<number>,
  session: Array<number>,
};

const getNonCompliantAthletes = async (): Promise<NonCompliantAthletes> => {
  const { data } = await axios.get(
    '/settings/athlete_push/non_compliant_athletes'
  );

  return data;
};

export default getNonCompliantAthletes;
