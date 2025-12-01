// @flow
import { axios } from '@kitman/common/src/utils/services';

const deleteMedicationFavorite = async (
  medicationFavoriteId: number
): Promise<void> => {
  const { data } = await axios.delete(
    `/ui/medical/medication_favorites/${medicationFavoriteId}`
  );
  return data;
};

export default deleteMedicationFavorite;
