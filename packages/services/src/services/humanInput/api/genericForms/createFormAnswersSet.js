// @flow
import { axios } from '@kitman/common/src/utils/services';

export const CREATE_FORM_ANSWERS_SET_ROUTE = '/forms/form_answers_sets';

const createFormAnswersSet = async ({
  formId,
  userId,
  organisationId,
}: {
  formId: number,
  userId?: number,
  organisationId?: number,
}): Promise<void> => {
  const { data } = await axios.post(CREATE_FORM_ANSWERS_SET_ROUTE, {
    form_id: formId,
    user_id: userId,
    organisation_id: organisationId,
  });

  return data;
};

export default createFormAnswersSet;
