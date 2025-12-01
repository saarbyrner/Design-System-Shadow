import { axios } from '@kitman/common/src/utils/services';
import { data } from '../mocks/data/getFormAnswerSetsAthletes';
import getFormAnswerSetsAthletes, {
  GET_FORM_ANSWER_SETS_ATHLETES_URL,
} from '../getFormAnswerSetsAthletes';

describe('getFormAnswerSetsAthletes', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getFormAnswerSetsAthletes({
      athlete_status_at_assignment: 'free_agent',
    });
    expect(returnedData).toEqual(data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'get');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      await getFormAnswerSetsAthletes({
        athlete_status_at_assignment: 'free_agent',
      });
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(GET_FORM_ANSWER_SETS_ATHLETES_URL, {
        params: { athlete_status_at_assignment: 'free_agent' },
      });
    });
  });
});
