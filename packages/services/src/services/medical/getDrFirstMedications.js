// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { DrFirstMedicationsFilter } from '@kitman/modules/src/Medical/shared/types';
import type { DrFirstMedicationsDataResponse } from '@kitman/modules/src/Medical/shared/types/medical';

export type RequestResponse = {
  medications: Array<DrFirstMedicationsDataResponse>,
  next_id: ?number,
};

const getDrFirstMedications = async (
  filters: DrFirstMedicationsFilter,
  nextPage: ?number
): Promise<RequestResponse> => {
  const { data } = await axios.post('/ui/medical/medications/search', {
    filters: {
      ...filters,
    },
    next_id: nextPage,
  });

  return data;
};

export default getDrFirstMedications;
