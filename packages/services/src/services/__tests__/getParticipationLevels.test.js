import { data as serverResponse } from '@kitman/services/src/mocks/handlers/getParticipationLevels';

import { axios } from '@kitman/common/src/utils/services';
import getParticipationLevels from '../getParticipationLevels';

describe('getParticipationLevels', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const axiosGet = jest.spyOn(axios, 'get');
    const returnedData = await getParticipationLevels('game_event');

    expect(returnedData).toEqual(serverResponse);

    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith('/participation_levels', {
      headers: { Accept: 'application/json' },
      params: {
        event_type: 'game_event',
        non_none: false,
      },
    });
  });

  it('returns the non none options', async () => {
    const axiosGet = jest.spyOn(axios, 'get');
    const nonNone = true;
    const returnedData = await getParticipationLevels('game_event', nonNone);

    expect(returnedData).toEqual([serverResponse[0]]);

    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith('/participation_levels', {
      headers: { Accept: 'application/json' },
      params: {
        event_type: 'game_event',
        non_none: nonNone,
      },
    });
  });

  it('throws an error', async () => {
    jest.spyOn(axios, 'get').mockImplementation(() => {
      throw new Error();
    });

    await expect(async () => {
      await getParticipationLevels('game_event');
    }).rejects.toThrow();
  });
});
