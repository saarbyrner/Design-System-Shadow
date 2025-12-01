import { axios } from '@kitman/common/src/utils/services';
import { data } from '../mocks/handlers/fetchAdministrationAthletes';
import fetchAdministrationAthletes from '../api/fetchAdministrationAthletes';

describe('fetchAdministrationAthletes', () => {
  let fetchRequest;

  beforeEach(() => {
    fetchRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await fetchAdministrationAthletes({
      active: true,
      page: 2,
      per_page: 30,
    });

    expect(returnedData).toEqual(data.activeAthletes);
    expect(fetchRequest).toHaveBeenCalledTimes(1);
    expect(fetchRequest).toHaveBeenCalledWith('/administration/athletes', {
      headers: {
        'content-type': 'application/json',
        Accept: 'application/json',
      },
      params: { active: true, page: 2, per_page: 30 },
    });
  });
});
