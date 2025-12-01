// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { IndividualFormResult } from '@kitman/modules/src/HumanInput/types/forms';

const getFormResults = async (
  formId: number
): Promise<IndividualFormResult> => {
  const url = window.featureFlags['medical-forms-new-endpoints']
    ? `/forms/form_answers_sets/${formId}`
    : `/ui/concussion/form_answers_sets/${formId}`;

  const { data } = await axios.get(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return data;
};

export default getFormResults;
