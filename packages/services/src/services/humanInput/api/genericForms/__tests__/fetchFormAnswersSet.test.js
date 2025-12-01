import { axios } from '@kitman/common/src/utils/services';

// The same structure is returned as in the athlete profile
import { humanInputFormMockData } from '@kitman/services/src/services/humanInput/api/mocks/data/shared/humanInputForm.mock';
import fetchFormAnswersSet, {
  generateFetchFormAnswersSetUrl,
} from '../fetchFormAnswersSet';

describe('fetchFormAnswersSet', () => {
  let fetchFormAnswersSetRequest;

  beforeEach(() => {
    fetchFormAnswersSetRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formAnswersSetId = 1;
    const returnedData = await fetchFormAnswersSet(formAnswersSetId);

    expect(returnedData).toEqual(humanInputFormMockData);
    expect(fetchFormAnswersSetRequest).toHaveBeenCalledTimes(1);
    expect(fetchFormAnswersSetRequest).toHaveBeenCalledWith(
      generateFetchFormAnswersSetUrl(formAnswersSetId)
    );
  });
});
