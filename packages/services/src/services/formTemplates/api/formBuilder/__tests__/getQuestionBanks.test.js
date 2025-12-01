import { axios } from '@kitman/common/src/utils/services';
import { numberData } from '@kitman/services/src/services/formTemplates/api/mocks/data/formBuilder/getQuestionBanks';
import getQuestionBanks, {
  GET_QUESTION_BANKS_ROUTE,
} from '../getQuestionBanks';

describe('getQuestionBanks', () => {
  let getQuestionBanksRequest;

  beforeEach(() => {
    getQuestionBanksRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const questionType = 'number';
    const returnedData = await getQuestionBanks(questionType);

    expect(returnedData).toEqual(numberData);
    expect(getQuestionBanksRequest).toHaveBeenCalledTimes(1);
    expect(getQuestionBanksRequest).toHaveBeenCalledWith(
      GET_QUESTION_BANKS_ROUTE,
      {
        params: { question_type: 'number' },
      }
    );
  });
});
