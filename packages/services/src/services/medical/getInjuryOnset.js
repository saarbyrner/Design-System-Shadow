// @flow
import { axios } from '@kitman/common/src/utils/services';

export type InjuryOnset = {
  id: number,
  name: string,
  require_additional_input: boolean,
};
export type InjuryOnsets = Array<InjuryOnset>;

export const GET_INJURY_ONSET_URL = '/emr/issue_occurrence_onsets';

const getInjuryOnset = async (): Promise<InjuryOnsets> => {
  const { data } = await axios.get(GET_INJURY_ONSET_URL);
  return data ?? [];
};

export default getInjuryOnset;
