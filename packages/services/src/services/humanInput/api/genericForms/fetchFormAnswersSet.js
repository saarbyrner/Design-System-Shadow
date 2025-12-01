// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { HumanInputForm } from '@kitman/modules/src/HumanInput/types/forms';

export const generateFetchFormAnswersSetUrl = (formAnswersSetId: number) =>
  `/forms/form_answers_sets/${formAnswersSetId}/edit`;

const fetchFormAnswersSet = async (
  formAnswersSetId: number
): Promise<HumanInputForm> => {
  const url = generateFetchFormAnswersSetUrl(formAnswersSetId);
  const { data } = await axios.get(url);

  return data;
};

export default fetchFormAnswersSet;
