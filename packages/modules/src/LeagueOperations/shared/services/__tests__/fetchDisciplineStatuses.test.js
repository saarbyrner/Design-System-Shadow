import { axios } from '@kitman/common/src/utils/services';
import fetchDisciplineStatuses from '../fetchDisciplineStatuses';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    get: jest.fn(),
  },
}));

describe('fetchDisciplineStatuses', () => {
  it('should fetch and return discipline statuses', async () => {
    const mockResponse = { data: ['suspended', 'eligible'] };
    axios.get.mockResolvedValueOnce(mockResponse);

    const result = await fetchDisciplineStatuses();

    expect(axios.get).toHaveBeenCalledWith('/discipline/statuses');
    expect(result).toEqual(['suspended', 'eligible']);
  });
});
