// @flow
import type {
  FormUpdateRequestBody,
  BulkCreateFormAnswersSetRequestBody,
} from '@kitman/services/src/services/humanInput/api/types';
import { FORM_STATUS } from '@kitman/modules/src/HumanInput/types/forms';

export const updateFormAnswersSetRequestBody: FormUpdateRequestBody = {
  form_answers_set: {
    id: 1,
  },
  answers: [
    {
      form_element_id: 1,
      value: 123,
    },
    {
      form_element_id: 2,
      value: 'test',
    },
    {
      form_element_id: 3,
      value: true,
    },
  ],
  status: FORM_STATUS.COMPLETE,
};

export const bulkCreateFormAnswersSetRequestBody: BulkCreateFormAnswersSetRequestBody =
  {
    answers: [
      {
        form_element_id: 1,
        value: 123,
      },
      {
        form_element_id: 2,
        value: 'test',
      },
      {
        form_element_id: 3,
        value: true,
      },
    ],
    status: FORM_STATUS.COMPLETE,
    userId: 1,
    formId: 1,
  };
