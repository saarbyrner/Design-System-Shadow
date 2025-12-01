// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  CreateGuardianResponse,
  CreateGuardianRequestBody,
} from '../types';

export const generateCreateGuardiansUrl = (athleteId: number) =>
  `/athletes/${athleteId}/guardians`;

const createGuardian = async (
  guardianData: CreateGuardianRequestBody
): Promise<CreateGuardianResponse> => {
  const url = generateCreateGuardiansUrl(guardianData.athleteId);
  const { athleteId, ...payload } = guardianData;
  const { data } = await axios.post(url, payload);

  return data;
};

export default createGuardian;
