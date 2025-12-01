import { axios } from '@kitman/common/src/utils/services';
import { response } from '../../mocks/data/mock_version';
import saveFollowupQuestions from '../saveFollowupQuestions';

const MOCK_CONDITION = response.data.conditions[0];

describe('saveFollowupQuestions', () => {
  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'patch');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await saveFollowupQuestions({
        rulesetId: 58,
        versionId: 1,
        questionId: 26,
        questions: MOCK_CONDITION.questions,
      });

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/conditional_fields/rulesets/58/versions/1/questions/26/create_child_questions',
        { questions: MOCK_CONDITION.questions }
      );
    });
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await saveFollowupQuestions({
      rulesetId: 58,
      versionId: 1,
      questionId: 26,
      questions: MOCK_CONDITION.questions,
    });

    expect(returnedData).toEqual(response.data.conditions[0]);
  });
});
