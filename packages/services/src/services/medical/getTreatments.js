// @flow
import { axios } from '@kitman/common/src/utils/services';

import type {
  TreatmentSession,
  TreatmentAPIFilter,
} from '@kitman/modules/src/Medical/shared/types';

export type RequestResponse = {
  treatment_sessions: Array<TreatmentSession>,
  total_count: number,
  meta: {
    next_page: number,
    current_page: number,
    prev_page: number,
    total_count: number,
    total_pages: number,
  },
};

type TreatmentsRequest = {
  filters: TreatmentAPIFilter,
  nextPage: ?number,
  scopeToSquad: boolean,
  abortSignal: AbortSignal,
};

const getTreatments = async ({
  filters,
  nextPage,
  scopeToSquad = false,
  abortSignal,
}: TreatmentsRequest): Promise<RequestResponse> => {
  const { data } = await axios.post(
    '/treatment_sessions/search',
    {
      ...filters,
      page: nextPage,
      scope_to_squad: scopeToSquad,
    },
    { signal: abortSignal }
  );

  return data;
};

export default getTreatments;
