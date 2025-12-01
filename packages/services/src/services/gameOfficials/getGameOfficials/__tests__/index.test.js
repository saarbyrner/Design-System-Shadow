import { axios } from '@kitman/common/src/utils/services';
import mock from '@kitman/modules/src/MatchDay/shared/mock';
import getGameOfficials from '..';

describe('getGameOfficials', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'get');

    const data = await getGameOfficials({ eventId: 12 });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      '/planning_hub/events/12/game_officials'
    );
    expect(data).toEqual(mock.gameOfficials);
  });

  it('returns unparsed officials', async () => {
    jest.spyOn(axios, 'get');

    const data = await getGameOfficials({
      eventId: 12,
      ignoreParseByRole: true,
    });

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      '/planning_hub/events/12/game_officials'
    );
    expect(data).toEqual(Object.values(mock.gameOfficials));
  });
});
