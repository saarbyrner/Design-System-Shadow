import { axios } from '@kitman/common/src/utils/services';
import getLeagueSeasons from '..';
import mockLeagueSeasons from '../mock';

describe('getLeagueSeasons', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'get');

    const data = await getLeagueSeasons();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith('/league_seasons');
    expect(data).toEqual(mockLeagueSeasons);
  });
});
