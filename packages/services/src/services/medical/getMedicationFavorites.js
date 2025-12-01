// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  MedicationFavoriteResponse,
  DrugType,
} from '@kitman/modules/src/Medical/shared/types/medical';

const getMedicationFavorites = async (
  drugId: number,
  drugType: ?(DrugType | 'FdbDispensableDrug')
): Promise<Array<MedicationFavoriteResponse>> => {
  const { data } = await axios.get('/ui/medical/medication_favorites', {
    headers: {
      'content-type': 'application/json',
      Accept: 'application/json',
    },
    params: {
      drug_type: drugType || 'FdbDispensableDrug',
      drug_id: drugId.toString(),
    },
  });
  return data;
};

export default getMedicationFavorites;
