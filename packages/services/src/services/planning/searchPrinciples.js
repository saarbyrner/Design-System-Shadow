// @flow
import type { Principle } from '@kitman/common/src/types/Principles';
import { axios } from '@kitman/common/src/utils/services';

export type PrinciplesSearchParams = {
  squadIds?: Array<number>,
  isForCurrentSquadOnly?: boolean,
};

export const searchPrinciples = async (
  { squadIds, isForCurrentSquadOnly }: PrinciplesSearchParams = {
    squadIds: [],
    isForCurrentSquadOnly: false,
  }
): Promise<Array<Principle>> => {
  const { data } = await axios.post('/ui/planning_hub/principles/search', {
    // If an empty array is passed and isForCurrentSquadOnly is false, no
    // results are returned.
    squad_ids: squadIds && squadIds?.length > 0 ? squadIds : null,
    current_squad: isForCurrentSquadOnly,
  });
  return data;
};
