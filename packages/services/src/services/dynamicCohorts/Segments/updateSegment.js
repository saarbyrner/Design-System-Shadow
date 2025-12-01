// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Predicate } from '@kitman/modules/src/ConditionalFields/shared/types';
import baseSegmentsURL from './consts';
import type { FullSegmentResponse } from './createSegment';

export type SegmentToUpdate = {
  id: number,
  name: ?string,
  expression: ?Predicate,
};

export const updateSegment = async (
  segment: SegmentToUpdate
): Promise<FullSegmentResponse> => {
  // the expression in the segment needs to be a string for the BE to read it
  const convertedExpressionToString = JSON.stringify(segment.expression);

  const { data } = await axios.patch(`${baseSegmentsURL}/${segment.id}`, {
    ...segment,
    expression: convertedExpressionToString,
  });

  return data;
};

export default updateSegment;
