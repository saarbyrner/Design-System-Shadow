import { axios } from '@kitman/common/src/utils/services';
import {
  exerciseFavorites as serverResponse,
  customDrugsFavorites,
} from '@kitman/services/src/mocks/handlers/favoriting/data.mock';
import { getFavorites, makeFavorite, deleteFavorite } from '../favoriting';

describe('getFavorites', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const getFavoritesRequest = jest
      .spyOn(axios, 'get')
      .mockImplementation(() => Promise.resolve({ data: serverResponse }));

    const returnedData = await getFavorites('rehab_exercises', true);

    expect(returnedData).toEqual(serverResponse);

    expect(getFavoritesRequest).toHaveBeenCalledTimes(1);
    expect(getFavoritesRequest).toHaveBeenCalledWith('/user_favorites', {
      params: {
        favorite_type: 'rehab_exercises',
        exclude_remainder: true,
      },
    });
  });

  it('returns the correct response from MSW handler', async () => {
    const returnedData = await getFavorites('custom_drugs', true);

    expect(returnedData).toEqual(customDrugsFavorites);
  });
});

describe('makeFavorite', () => {
  let makeFavoriteRequest;

  beforeEach(() => {
    makeFavoriteRequest = jest
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: serverResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await makeFavorite(1, 'rehab_exercises', true);

    expect(returnedData).toEqual(serverResponse);

    expect(makeFavoriteRequest).toHaveBeenCalledTimes(1);
    expect(makeFavoriteRequest).toHaveBeenCalledWith('/user_favorites', {
      id: 1,
      favorite_type: 'rehab_exercises',
      exclude_remainder: true,
    });
  });
});

describe('deleteFavorite', () => {
  let deleteFavoriteRequest;

  beforeEach(() => {
    deleteFavoriteRequest = jest
      .spyOn(axios, 'delete')
      .mockResolvedValue({ data: serverResponse });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await deleteFavorite(1, 'rehab_exercises', true);

    expect(returnedData).toEqual(serverResponse);

    expect(deleteFavoriteRequest).toHaveBeenCalledTimes(1);
    expect(deleteFavoriteRequest).toHaveBeenCalledWith('/user_favorites', {
      data: {
        id: 1,
        favorite_type: 'rehab_exercises',
        exclude_remainder: true,
      },
    });
  });
});
