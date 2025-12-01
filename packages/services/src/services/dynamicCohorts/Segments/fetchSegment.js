// @flow
import { axios } from '@kitman/common/src/utils/services';
import baseSegmentsURL from './consts';
import type { FullSegmentResponse } from './createSegment';

export const fetchSegment = async ({
  id,
}: {
  id: number,
}): Promise<FullSegmentResponse> => {
  const { data } = await axios.get(`${baseSegmentsURL}/${id}`);
  return data;
};

export default fetchSegment;
