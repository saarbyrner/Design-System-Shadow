import { axios } from '@kitman/common/src/utils/services';

import { humanInputFormMockData } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';
import { bulkCreateFormAnswersSetRequestBody } from '@kitman/services/src/services/humanInput/api/mocks/data/shared';
import bulkCreateFormAnswersSet, {
  BULK_CREATE_FORM_ANSWERS_SET_ROUTE,
} from '../bulkCreateFormAnswersSet';

describe('bulkCreateFormAnswersSet', () => {
  let bulkCreateFormAnswersSetRequest;

  beforeEach(() => {
    bulkCreateFormAnswersSetRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const props = bulkCreateFormAnswersSetRequestBody;
    const returnedData = await bulkCreateFormAnswersSet(props);

    expect(returnedData).toEqual(humanInputFormMockData);
    expect(bulkCreateFormAnswersSetRequest).toHaveBeenCalledTimes(1);
    expect(bulkCreateFormAnswersSetRequest).toHaveBeenCalledWith(
      BULK_CREATE_FORM_ANSWERS_SET_ROUTE,
      {
        answers: props.answers,
        form_id: props.formId,
        status: props.status,
        user_id: props.userId,
      }
    );
  });
});
