import { response } from '../../mocks/data/mock_squads_settings';

import fetchSquadSettings from '../fetchSquadSettings';

describe('fetchSquadSettings', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchSquadSettings();

    expect(returnedData.length).toEqual(response.length);
  });
});
