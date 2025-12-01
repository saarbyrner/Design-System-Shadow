// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { RehabGroup } from '@kitman/modules/src/Medical/shared/components/RehabTab/types';

export type RehabGroupAssociationData = {
  tag_id: number,
};

const removeGroupFromRehabSessionExercise = async (
  id: number
): Promise<RehabGroup> => {
  const { data } = await axios.delete(`/tags/${id}`);
  return data;
};

export default removeGroupFromRehabSessionExercise;
