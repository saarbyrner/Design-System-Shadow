import { axios } from '@kitman/common/src/utils/services';
import { data as response } from '@kitman/services/src/mocks/handlers/medical/searchPastAthletes';
import searchPastAthletes from '@kitman/services/src/services/medical/searchPastAthletes';

const searchString = 'dummy search';

describe('searchPastAthletes', () => {
  let request;
  it('returns the correct value', async () => {
    const returnedData = await searchPastAthletes({
      searchString,
    });
    expect(returnedData).toEqual(response);
  });

  describe('Mock axios', () => {
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint and returns the correct value', async () => {
      const returnedData = await searchPastAthletes({
        searchString,
      });

      expect(returnedData).toEqual(response);

      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(
        '/medical/rosters/search_past_athletes',
        {
          search_expression: searchString,
        }
      );
    });
  });
});
