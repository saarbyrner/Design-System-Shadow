// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  UpdateGuardianResponse,
  UpdateGuardianRequestBody,
} from '../types';

export const generateUpdateGuardiansUrl = (athleteId: number, id: number) =>
  `/athletes/${athleteId}/guardians/${id}`;

const updateGuardian = async (
  guardianData: UpdateGuardianRequestBody
): Promise<UpdateGuardianResponse> => {
  const url = generateUpdateGuardiansUrl(
    guardianData.athleteId,
    guardianData.id
  );
  const { athleteId, id, ...payload } = guardianData;
  const { data } = await axios.put(url, payload);

  return data;
};

export default updateGuardian;
