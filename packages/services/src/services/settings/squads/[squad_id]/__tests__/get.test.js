import { axios } from '@kitman/common/src/utils/services';

import getSquadAthletes from '../get';

describe('get', () => {
  const squadId = 3194;

  it('calls the correct endpoint with the correct data and headers', async () => {
    const axiosGet = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve());

    await getSquadAthletes(squadId);

    expect(axiosGet).toHaveBeenCalledTimes(1);
    expect(axiosGet).toHaveBeenCalledWith('/settings/squads/3194');
  });
});
