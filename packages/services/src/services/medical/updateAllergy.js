// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  AllergyData,
  AllergyDataResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';

const updateAllergy = async (
  allergyId: number,
  allergyData: AllergyData
): Promise<AllergyDataResponse> => {
  const { data } = await axios.put(`/medical/allergies/${allergyId}/update`, {
    attributes: {
      ...allergyData,
    },
  });

  return data;
};

export default updateAllergy;
