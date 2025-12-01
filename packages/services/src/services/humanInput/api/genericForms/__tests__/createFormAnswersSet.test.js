import { axios } from '@kitman/common/src/utils/services';

import { humanInputFormMockData } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';
import createFormAnswersSet, {
  CREATE_FORM_ANSWERS_SET_ROUTE,
} from '../createFormAnswersSet';

describe('createFormAnswersSet', () => {
  let createFormAnswersSetRequest;

  beforeEach(() => {
    createFormAnswersSetRequest = jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formId = 123;
    const userId = 456;
    const organisationId = 789;
    const returnedData = await createFormAnswersSet({
      formId,
      userId,
      organisationId,
    });

    expect(returnedData).toEqual(humanInputFormMockData);
    expect(createFormAnswersSetRequest).toHaveBeenCalledTimes(1);
    expect(createFormAnswersSetRequest).toHaveBeenCalledWith(
      CREATE_FORM_ANSWERS_SET_ROUTE,
      { form_id: formId, user_id: userId, organisation_id: organisationId }
    );
  });
});
