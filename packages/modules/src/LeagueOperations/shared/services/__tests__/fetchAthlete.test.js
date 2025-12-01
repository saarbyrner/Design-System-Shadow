import { response } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_athlete_list';

import fetchAthlete from '../fetchAthlete';

describe('fetchAthlete', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchAthlete('645235245664daf0f8fccc44');

    expect(returnedData).toEqual(response.data[0]);
  });
});
