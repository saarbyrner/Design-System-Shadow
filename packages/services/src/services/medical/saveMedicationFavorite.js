// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  MedicationFavoriteRequest,
  MedicationFavoriteResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';

const saveMedicationFavorite = async (
  medicationFavorite: MedicationFavoriteRequest
): Promise<MedicationFavoriteResponse> => {
  const { data } = await axios.post(
    '/ui/medical/medication_favorites',
    medicationFavorite
  );
  return data;
};

export default saveMedicationFavorite;
