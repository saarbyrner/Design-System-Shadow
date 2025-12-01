import { axios } from '@kitman/common/src/utils/services';

import { humanInputFormMockData } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';
import autosavePatchFormAnswersSet from '../autosavePatchFormAnswersSet';

const autosavePatchFormAnswersSetRequestBody = {
  formAnswersSetId: { id: 123 },
  answers: { 1: { answer: 'Autosaved answer' } },
  status: 'draft',
};
describe('autosavePatchFormAnswersSet', () => {
  let autosavePatchFormAnswersSetRequest;

  beforeEach(() => {
    autosavePatchFormAnswersSetRequest = jest.spyOn(axios, 'patch');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const props = autosavePatchFormAnswersSetRequestBody;
    const returnedData = await autosavePatchFormAnswersSet({
      form_answers_set: props.formAnswersSetId,
      answers: props.answers,
      status: props.status,
    });

    expect(returnedData).toEqual(humanInputFormMockData);
    expect(autosavePatchFormAnswersSetRequest).toHaveBeenCalledTimes(1);
    expect(autosavePatchFormAnswersSetRequest).toHaveBeenCalledWith(
      `/forms/form_answers_sets/${123}/bulk_update`,
      { form_answers: props.answers, status: props.status }
    );
  });
});
