import { axios } from '@kitman/common/src/utils/services';
import updateFormAnswersSetLinkedIssues, {
  URL,
} from '../updateFormAnswersSetLinkedIssues';

describe('updateFormAnswersSetLinkedIssues', () => {
  let request;

  // MSW handler test
  it('returns the correct value', async () => {
    const returnedData = await updateFormAnswersSetLinkedIssues(1, {
      injury_occurrence_ids: [1, 2, 3],
    });
    expect(returnedData).toEqual('');
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      request = jest.spyOn(axios, 'patch');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await updateFormAnswersSetLinkedIssues(1, {
        injury_occurrence_ids: [1, 2, 3],
      });

      const bodyData = {
        form_answers_set_id: 1,
        injury_occurrence_ids: [1, 2, 3],
      };
      expect(request).toHaveBeenCalledWith(URL, bodyData);
    });
  });
});
