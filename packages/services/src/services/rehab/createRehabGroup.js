// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  CreateRehabGroup,
  RehabGroup,
} from '@kitman/modules/src/Medical/shared/components/RehabTab/types';

export type RequestResponse = {
  data: Array<RehabGroup>,
};

const createRehabGroup = async (
  postData: CreateRehabGroup
): Promise<RehabGroup> => {
  const { data } = await axios.post('/tags', postData);
  return data;
};

export default createRehabGroup;
