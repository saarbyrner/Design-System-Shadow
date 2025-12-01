// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AllergyDataResponse } from '@kitman/modules/src/Medical/shared/types/medical';

// retrieves single allergy for current athlete

const getCurrentAllergy = async (
  allergyID: number
): Promise<AllergyDataResponse> => {
  const { data } = await axios.get(`/ui/medical/allergies/${allergyID}`);
  return data;
};
export default getCurrentAllergy;
