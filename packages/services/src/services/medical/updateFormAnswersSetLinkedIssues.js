// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { LinkedIssues } from '@kitman/modules/src/Medical/shared/types';

export const URL = '/emr/form_answers_set_pdf_exports/update_issues';

const updateFormAnswersSetLinkedIssues = async (
  formAnswersSetId: number,
  linkedIssues: LinkedIssues
): Promise<void> => {
  const { data } = await axios.patch(URL, {
    ...linkedIssues,
    form_answers_set_id: formAnswersSetId,
  });

  return data;
};

export default updateFormAnswersSetLinkedIssues;
