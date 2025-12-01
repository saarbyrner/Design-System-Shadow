// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { AllergiesFilter } from '@kitman/modules/src/Medical/shared/types';
import type { AllergyDataResponse } from '@kitman/modules/src/Medical/shared/types/medical';

export type RequestResponse = {
  allergies: Array<AllergyDataResponse>,
  next_id?: number,
};

const getAllergies = async (
  filters: AllergiesFilter,
  nextAllergiesPage: ?number
): Promise<RequestResponse> => {
  const { data } = await axios.post('/ui/medical/allergies/search', {
    filters: {
      ...filters,
    },
    next_id: nextAllergiesPage,
    organisation_only: true,
  });
  return data;
};

export default getAllergies;
