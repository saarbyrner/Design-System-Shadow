// @flow
import { axios } from '@kitman/common/src/utils/services';

const formAnswerSetsDelete = async (formId: number): Promise<any> => {
  const { data } = await axios.delete(
    `/ui/concussion/form_answers_sets/${formId}`
  );

  return data;
};

export default formAnswerSetsDelete;
