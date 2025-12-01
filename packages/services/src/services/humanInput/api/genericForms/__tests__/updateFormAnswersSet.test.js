import { axios } from '@kitman/common/src/utils/services';

import { humanInputFormMockData } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';
import { updateFormAnswersSetRequestBody } from '@kitman/services/src/services/humanInput/api/mocks/data/shared';
import updateFormAnswersSet, {
  generateUpdateFormAnswersSetUrl,
} from '../updateFormAnswersSet';

describe('updateFormAnswersSet', () => {
  let updateFormAnswersSetRequest;

  beforeEach(() => {
    updateFormAnswersSetRequest = jest.spyOn(axios, 'put');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const props = updateFormAnswersSetRequestBody;
    const returnedData = await updateFormAnswersSet(props);

    expect(returnedData).toEqual(humanInputFormMockData);
    expect(updateFormAnswersSetRequest).toHaveBeenCalledTimes(1);
    expect(updateFormAnswersSetRequest).toHaveBeenCalledWith(
      generateUpdateFormAnswersSetUrl(props.form_answers_set.id),
      { form_answers: props.answers, status: 'complete' }
    );
  });
});
