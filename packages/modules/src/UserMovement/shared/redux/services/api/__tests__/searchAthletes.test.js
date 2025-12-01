import { axios } from '@kitman/common/src/utils/services';
import searchAthletes from '../searchAthletes';

describe('searchAthletes', () => {
  const args = {
    is_active: true,
    search_expression: '',
    organisation_ids: null,
    division_ids: null,
    career_status: null,
    position_ids: null,
    squad_ids: null,
    label_ids: null,
    per_page: 30,
    page: 1,
    'include_athlete_game_status?': false,
  };

  it('calls the correct URL with the correct HTTP verb and args', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({});

    await searchAthletes(args);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('/settings/athletes/search', {
      ...args,
    });
  });

  it('calls the correct URL with squad_ids', async () => {
    const argsWithSquadIds = {
      is_active: true,
      search_expression: '',
      organisation_ids: null,
      division_ids: null,
      career_status: null,
      position_ids: null,
      label_ids: null,
      squad_ids: [1],
      per_page: 30,
      page: 1,
      'include_athlete_game_status?': false,
    };

    jest.spyOn(axios, 'post').mockResolvedValue({});

    await searchAthletes(argsWithSquadIds);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('/settings/athletes/search', {
      ...args,
      ...argsWithSquadIds,
    });
  });

  describe('failure', () => {
    it('throws an error', async () => {
      const errorMessage = 'Request failed';
      jest.spyOn(axios, 'post').mockRejectedValue(new Error(errorMessage));

      await expect(searchAthletes()).rejects.toThrow(errorMessage);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
