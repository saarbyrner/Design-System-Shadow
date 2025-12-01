import { axios } from '@kitman/common/src/utils/services';
import searchKitMatrices from '..';
import mockData from '../mock';

describe('searchKitMatrices', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'post');

    const filters = {
      archived: true,
      kinds: ['player', 'referee_official', 'goalkeeper'],
      search_expression: 'search',
      organisation_ids: [1, 2, 3],
      squad_ids: [1, 2, 3],
      division_ids: [1, 2, 3],
      kit_matrix_color_ids: [1, 2, 3],
    };

    const data = await searchKitMatrices({
      ...filters,
      include_games_count: true,
    });

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      '/planning_hub/kit_matrices/search',
      filters,
      {
        params: {
          include_games_count: true,
        },
      }
    );
    expect(data).toEqual(mockData);
  });

  it('calls the endpoint with "include_games_count" false', async () => {
    jest.spyOn(axios, 'post');

    const filters = {
      archived: true,
      kinds: ['player', 'referee_official', 'goalkeeper'],
      search_expression: 'search',
      organisation_ids: [1, 2, 3],
      squad_ids: [1, 2, 3],
      division_ids: [1, 2, 3],
      kit_matrix_color_ids: [1, 2, 3],
    };

    await searchKitMatrices({
      ...filters,
      include_games_count: false,
    });

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      '/planning_hub/kit_matrices/search',
      filters,
      {
        params: {
          include_games_count: false,
        },
      }
    );
  });
});
