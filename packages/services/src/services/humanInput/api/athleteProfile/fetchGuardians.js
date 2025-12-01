// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { FetchGuardiansResponse } from '../types';

export const generateFetchGuardiansUrl = (athleteId: number) =>
  `/athletes/${athleteId}/guardians?include_deleted=false`;

const fetchGuardians = async (
  athleteId: number
): Promise<FetchGuardiansResponse> => {
  const url = generateFetchGuardiansUrl(athleteId);
  const { data } = await axios.get(url);

  return data;
};

export default fetchGuardians;
