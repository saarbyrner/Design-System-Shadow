// flow
// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { SegmentFormState } from '@kitman/modules/src/DynamicCohorts/Segments/CreateEditSegment/redux/slices/segmentSlice';
import type { Predicate } from '@kitman/modules/src/ConditionalFields/shared/types';
import baseSegmentsURL from './consts';

export type FullSegmentResponse = {
  id: number,
  name: string,
  expression: Predicate,
  created_by: { id: number, fullname: string },
  created_on: string,
};

export const createSegment = async (
  segment: SegmentFormState
): Promise<FullSegmentResponse> => {
  const expressionToString = {
    ...segment,
    expression: JSON.stringify(segment.expression),
  };

  const { data } = await axios.post(baseSegmentsURL, expressionToString);

  return data;
};

export default createSegment;
