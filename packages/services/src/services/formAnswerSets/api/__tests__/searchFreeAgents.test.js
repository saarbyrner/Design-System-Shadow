import { axios } from '@kitman/common/src/utils/services';
import { data } from '../mocks/data/searchFreeAgents';
import searchFreeAgents, { SEARCH_FREE_AGENTS_URL } from '../searchFreeAgents';

describe('searchFreeAgents', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await searchFreeAgents({
      category: 'medical,general',
      statuses: [],
      pagination: {
        page: 1,
        per_page: 25,
      },
    });
    expect(returnedData).toEqual(data);
  });

  describe('Mock axios', () => {
    let request;
    beforeEach(() => {
      request = jest.spyOn(axios, 'post');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls the correct endpoint with correct body data in the request', async () => {
      const payload = {
        category: 'medical,general',
        statuses: [],
        pagination: {
          page: 1,
          per_page: 25,
        },
      };
      await searchFreeAgents(payload);
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith(SEARCH_FREE_AGENTS_URL, {
        ...payload,
        isInCamelCase: true,
      });
    });
  });
});
