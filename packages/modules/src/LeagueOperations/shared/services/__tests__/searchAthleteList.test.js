import { response } from '@kitman/modules/src/LeagueOperations/shared/services/mocks/data/mock_athlete_list';

import searchAthleteList from '../searchAthleteList';

describe('searchAthleteList', () => {
  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await searchAthleteList({});

    expect(returnedData.data.length).toEqual(response.data.length);
  });
});
