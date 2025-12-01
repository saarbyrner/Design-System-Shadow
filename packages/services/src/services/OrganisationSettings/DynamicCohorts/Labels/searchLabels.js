// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { CreatedOn } from '@kitman/modules/src/DynamicCohorts/shared/utils/types';
import type { FullLabelResponse } from './createLabel';
import baseLabelsURL from './consts';

export type SearchLabelsResponse = {
  labels: Array<FullLabelResponse>,
  next_id: number | null,
};

export const searchLabels = async ({
  nextId,
  searchValue,
  createdBy,
  createdOn,
}: {
  nextId: number,
  searchValue: string,
  createdBy: Array<number>,
  createdOn: CreatedOn,
}): Promise<SearchLabelsResponse> => {
  const { data } = await axios.post(`${baseLabelsURL}/paginated`, {
    next_id: nextId,
    search_expression: searchValue,
    created_by: createdBy,
    date_range: createdOn,
  });

  return data;
};

export default searchLabels;
