// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { InjuryIllnessUpdate } from '@kitman/services/src/types';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';

const updateIssueType = async (
  payload: InjuryIllnessUpdate
): Promise<IssueOccurrenceRequested> => {
  const { data } = await axios.patch(
    `/athletes/${payload.athlete_id}/issues/issues_type_update`,
    payload
  );
  return data;
};

export default updateIssueType;
