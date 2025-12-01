// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { ActiveQuestion, SerializedQuestion } from '../../types';

const saveFollowupQuestions = async ({
  rulesetId,
  versionId,
  questionId,
  questions,
}: {
  rulesetId: string,
  versionId: string,
  questionId: string,
  questions: Array<ActiveQuestion>,
}): Promise<SerializedQuestion> => {
  const { data } = await axios.patch(
    `/conditional_fields/rulesets/${rulesetId}/versions/${versionId}/questions/${questionId}/create_child_questions`,
    { questions }
  );
  return data;
};

export default saveFollowupQuestions;
