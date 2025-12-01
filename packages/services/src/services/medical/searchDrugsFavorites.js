// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { MedicationSourceListName } from '@kitman/modules/src/Medical/shared/types/medical';
import type { SearchDrugsFavoritesResponse } from '@kitman/modules/src/Medical/shared/types/medical/Medications';

const searchDrugsFavorites = async (
  source: MedicationSourceListName,
  search: string
): Promise<SearchDrugsFavoritesResponse> => {
  const { data } = await axios.post('/medical/drugs/search_favorite_drugs', {
    medication_list_source: source,
    search_expression: search,
  });

  return data;
};

export default searchDrugsFavorites;
