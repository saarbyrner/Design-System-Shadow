// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  DeleteGuardianResponse,
  DeleteGuardianRequestBody,
} from '../types';

export const generateDeleteGuardiansUrl = (athleteId: number, id: number) =>
  `/athletes/${athleteId}/guardians/${id}`;

const deleteGuardian = async (
  guardianData: DeleteGuardianRequestBody
): Promise<DeleteGuardianResponse> => {
  const url = generateDeleteGuardiansUrl(
    guardianData.athleteId,
    guardianData.id
  );

  const { data } = await axios.delete(url);

  return data;
};

export default deleteGuardian;
