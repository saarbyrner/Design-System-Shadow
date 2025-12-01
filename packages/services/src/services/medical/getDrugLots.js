// @flow
import { axios } from '@kitman/common/src/utils/services';

import type {
  DrugLotFilters,
  DrugLotsResponse,
} from '@kitman/modules/src/Medical/shared/types/medical';

const getDrugLots = async (
  filters?: DrugLotFilters,
  nextPage?: number | null,
  abortSignal?: AbortSignal
): Promise<DrugLotsResponse> => {
  const { data } = await axios.post(
    `/medical/stocks/search_lots`,
    {
      // $FlowFixMe known 'bug' Flow Issue that they don't intend to fix soon
      ...filters,
      ...(nextPage && { next_id: nextPage }),
    },
    {
      ...(abortSignal && { signal: abortSignal }),
    }
  );

  return data;
};

export default getDrugLots;
