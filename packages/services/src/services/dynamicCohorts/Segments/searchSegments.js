// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { CreatedOn } from '@kitman/modules/src/DynamicCohorts/shared/utils/types';
import baseSegmentsURL from './consts';

export type SegmentResponse = {
  id: number,
  name: string,
  created_by: { id: number, fullname: string },
  created_on: string,
};
export type PaginatedSegmentsResponse = {
  segments: Array<SegmentResponse>,
  next_id: number | null,
};

export const searchSegments = async ({
  // filters will be added here in a later PR
  nextId,
  searchValue,
  createdBy,
  createdOn,
  labels,
}: {
  nextId: number,
  searchValue: string,
  createdBy: Array<number>,
  createdOn: CreatedOn,
  labels: Array<number>,
}): Promise<PaginatedSegmentsResponse> => {
  const { data } = await axios.post(`${baseSegmentsURL}/paginated`, {
    next_id: nextId,
    search_expression: searchValue,
    created_by: createdBy,
    date_range: createdOn,
    label_ids: labels,
  });

  return data;
};

export default searchSegments;
