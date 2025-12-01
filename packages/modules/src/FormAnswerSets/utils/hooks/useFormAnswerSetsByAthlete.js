// @flow

import type { CustomHookReturnType } from '@kitman/common/src/hooks/useGlobalAppBasicLoader';
import { useSearchFormAnswerSetsByAthleteQuery } from '@kitman/services/src/services/formAnswerSets';
import type {
  FormAnswerSetCompliance,
  SearchByAthleteParams,
} from '@kitman/services/src/services/formAnswerSets/api/types';

export const useFormAnswerSetsByAthlete = (
  page: number,
  perPage: number,
  athleteIds?: Array<number>,
  formIds?: Array<number>,
  startDate?: string,
  endDate?: string,
  skip?: boolean
): ({
  rows: Array<FormAnswerSetCompliance>,
  meta: {
    currentPage: number,
    totalPages: number,
    totalCount: number,
    perPage: number,
  },
  refetch: () => void,
  ...$Exact<CustomHookReturnType>,
}) => {
  const params: SearchByAthleteParams = {
    page,
    per_page: perPage,
  };

  if (athleteIds && athleteIds.length > 0) {
    params.athleteIds = athleteIds;
  }

  if (formIds && formIds.length > 0) {
    params.formIds = formIds;
  }

  if (startDate) {
    params.startDate = startDate;
  }

  if (endDate) {
    params.endDate = endDate;
  }

  const {
    refetch,
    data: response,
    isLoading,
    isSuccess,
    isError,
  } = useSearchFormAnswerSetsByAthleteQuery(params, {
    skip: skip || false,
  });

  const {
    data: rows = [],
    meta = { currentPage: 0, totalPages: 0, totalCount: 0, perPage: 0 },
  } = response || {};

  return { isLoading, isSuccess, isError, rows, meta, refetch };
};

export default useFormAnswerSetsByAthlete;
