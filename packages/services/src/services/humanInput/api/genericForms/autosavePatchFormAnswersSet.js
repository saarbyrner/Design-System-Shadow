// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { HumanInputForm } from '@kitman/modules/src/HumanInput/types/forms';
import type { FormUpdateRequestBody } from '../types';

export const generateUpdateFormAnswersSetUrl = (formAnswersSetId: number) =>
  `/forms/form_answers_sets/${formAnswersSetId}/bulk_update`;

const autosavePatchFormAnswersSet = async ({
  form_answers_set: formAnswersSetId,
  status,
  answers,
}: FormUpdateRequestBody): Promise<HumanInputForm> => {
  const url = generateUpdateFormAnswersSetUrl(formAnswersSetId.id);
  const { data } = await axios.patch(url, { form_answers: answers, status });

  return data;
};

export default autosavePatchFormAnswersSet;
