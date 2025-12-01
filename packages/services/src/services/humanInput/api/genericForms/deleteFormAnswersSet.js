// @flow
import { axios } from '@kitman/common/src/utils/services';

export const generateDeleteFormAnswersSetUrl = (formAnswersSetId: number) =>
  `/forms/form_answers_sets/${formAnswersSetId}`;

const deleteFormAnswersSet = async (
  formAnswersSetId: number
): Promise<void> => {
  const url = generateDeleteFormAnswersSetUrl(formAnswersSetId);
  await axios.delete(url);
};

export default deleteFormAnswersSet;
