// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { RehabGroup } from '@kitman/modules/src/Medical/shared/components/RehabTab/types';

export type RehabGroupAssociationData = {
  session_exercise_ids: Array<number>,
  tag_ids: Array<number>,
};

export type RequestResponse = {
  data: Array<RehabGroup>,
};

const addGroupsToRehabSessionExercises = async (
  postData: RehabGroupAssociationData
): Promise<RehabGroup> => {
  const { data } = await axios.post(
    '/ui/medical/rehab/session_exercises/tag',
    postData
  );
  return data;
};

export default addGroupsToRehabSessionExercises;
