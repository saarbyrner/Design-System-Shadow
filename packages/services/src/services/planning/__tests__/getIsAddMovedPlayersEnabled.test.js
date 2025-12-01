import { axios } from '@kitman/common/src/utils/services';
import getIsAddMovedPlayersEnabled from '../getIsAddMovedPlayersEnabled';

const mockData = [
  {
    value: true,
  },
];

describe('getIsAddMovedPlayersEnabled', () => {
  let request;

  beforeEach(() => {
    request = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => ({ data: mockData }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('makes the call to the correct endpoint', async () => {
    await getIsAddMovedPlayersEnabled();

    expect(request).toHaveBeenCalledWith(
      '/organisation_preferences/moved_players_in_organisation_at_event'
    );
  });

  it('returns the correct data', async () => {
    const data = await getIsAddMovedPlayersEnabled();

    expect(data).toEqual(mockData);
  });
});
