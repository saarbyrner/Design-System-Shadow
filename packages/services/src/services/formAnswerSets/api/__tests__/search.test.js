import { axios } from '@kitman/common/src/utils/services';
import searchFormAnswerSetsData from '@kitman/services/src/services/formAnswerSets/api/mocks/data/search';
import searchFormAnswerSets from '@kitman/services/src/services/formAnswerSets/api/search';

describe('searchFormAnswerSets', () => {
  let fetchMultipleFormAnswersSetsRequest;

  beforeEach(() => {
    fetchMultipleFormAnswersSetsRequest = jest
      .spyOn(axios, 'post')
      .mockReturnValue({ data: searchFormAnswerSetsData });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const category = 'medical';
    const key = 'rtp';
    const statuses = ['completed'];
    const pagination = {
      page: 1,
      per_page: 25,
    };
    const returnedData = await searchFormAnswerSets({
      category,
      key,
      statuses,
      pagination,
    });

    expect(returnedData).toEqual(searchFormAnswerSetsData);
    expect(fetchMultipleFormAnswersSetsRequest).toHaveBeenCalledTimes(1);
    expect(fetchMultipleFormAnswersSetsRequest).toHaveBeenCalledWith(
      '/forms/form_answers_sets/search',
      { category, statuses, key, pagination, isInCamelCase: true }
    );
  });
});
