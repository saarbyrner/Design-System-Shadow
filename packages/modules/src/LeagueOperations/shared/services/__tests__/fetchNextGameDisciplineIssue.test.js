import { axios } from '@kitman/common/src/utils/services';
import fetchNextGameDisciplineIssue from '../fetchNextGameDisciplineIssue';

jest.mock('@kitman/common/src/utils/services', () => ({
  axios: {
    post: jest.fn(),
  },
}));

describe('fetchNextGameDisciplineIssue', () => {
  const params = {
    number_of_games: 5,
    squad_id: 'squad-123',
    start_date: '2023-10-27',
    competition_ids: ['comp-A', 'comp-B'],
  };

  const apiResponse = {
    data: [
      {
        id: 1,
        name: 'Game 1',
        start_time: '2023-10-28T15:00:00Z',
        local_timezone: 'Europe/London',
        squad: { id: 101, name: 'Home Squad' },
        opponent_squad: { id: 202, name: 'Away Squad' },
      },
    ],
  };

  beforeEach(() => {
    axios.post.mockResolvedValue(apiResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls axios.post with correct arguments and returns the API data', async () => {
    const result = await fetchNextGameDisciplineIssue(params);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('/discipline/next_games', params);
    expect(result).toEqual(apiResponse.data);
  });
});
