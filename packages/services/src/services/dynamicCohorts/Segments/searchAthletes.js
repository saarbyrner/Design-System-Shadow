// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Predicate } from '@kitman/modules/src/ConditionalFields/shared/types';
import baseSegmentsURL from './consts';

export type AthleteInfo = {
  id: number,
  name: string,
  avatar: string,
};

export type PaginatedAthleteQueryResponse = {
  athletes: AthleteInfo,
  next_id: number | null,
};

export const searchAthletes = async ({
  expression,
  nextId,
}: {
  expression: ?Predicate,
  nextId: number | null,
}): Promise<PaginatedAthleteQueryResponse> => {
  // BE needs the expression to be a string
  const convertedExpressionToString = JSON.stringify(expression);

  const { data } = await axios.post(`${baseSegmentsURL}/query_athletes`, {
    expression: convertedExpressionToString,
    next_id: nextId,
  });

  return data;
};

export default searchAthletes;
