// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { HumanInputForm } from '@kitman/modules/src/HumanInput/types/forms';
import type { BulkCreateFormAnswersSetRequestBody } from '../types';

export const BULK_CREATE_FORM_ANSWERS_SET_ROUTE =
  '/forms/form_answers_sets/bulk_create';

const bulkCreateFormAnswersSet = async ({
  formId,
  userId,
  status,
  answers,
  organisationId,
}: BulkCreateFormAnswersSetRequestBody): Promise<HumanInputForm> => {
  const { data } = await axios.post(BULK_CREATE_FORM_ANSWERS_SET_ROUTE, {
    form_id: formId,
    user_id: userId,
    organisation_id: organisationId,
    answers,
    status,
  });

  return data;
};

export default bulkCreateFormAnswersSet;
