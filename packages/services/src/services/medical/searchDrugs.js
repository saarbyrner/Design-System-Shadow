// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { MedicationSourceListName } from '@kitman/modules/src/Medical/shared/types/medical';
import type { DrugSearchResponse } from '@kitman/modules/src/Medical/shared/types/medical/Medications';

const searchDrugs = async (
  source: MedicationSourceListName,
  search: string
): Promise<DrugSearchResponse> => {
  const { data } = await axios.post('/medical/drugs/search', {
    medication_list_source: source,
    search_expression: search,
  });

  return data;
};

export default searchDrugs;
