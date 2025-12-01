// @flow
import { axios } from '@kitman/common/src/utils/services';
import baseSegmentsURL from './consts';

export const deleteSegment = async (id: number) => {
  await axios.delete(`${baseSegmentsURL}/${id}`);
};

export default deleteSegment;
