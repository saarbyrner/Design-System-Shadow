// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AllergyDataResponse } from '@kitman/modules/src/Medical/shared/types/medical';

export type RequestResponse = {
  id: number,
  archived: boolean,
};

const archiveAllergy = async (
  allergy: AllergyDataResponse,
  reason: number
): Promise<RequestResponse> => {
  const { data } = await axios.patch(
    `/ui/medical/allergies/${allergy.id}/archive`,
    {
      archived: true,
      archive_reason_id: reason,
    }
  );

  return data;
};

export default archiveAllergy;
