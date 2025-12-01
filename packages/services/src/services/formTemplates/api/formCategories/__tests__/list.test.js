import { axios } from '@kitman/common/src/utils/services';

import { paginatedFormCategoriesData } from '@kitman/services/src/services/formTemplates/api/mocks/data/formCategories.mock';
import listCategories, {
  generateListCategoriesUrl,
} from '@kitman/services/src/services/formTemplates/api/formCategories/list';

describe('list categories', () => {
  let listFormCategoriesRequest;

  beforeEach(() => {
    listFormCategoriesRequest = jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: paginatedFormCategoriesData });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const searchQuery = null;
    const productArea = null;
    const url = generateListCategoriesUrl(searchQuery, productArea);

    const response = await listCategories({ searchQuery, productArea });

    expect(response).toEqual(paginatedFormCategoriesData);
    expect(listFormCategoriesRequest).toHaveBeenCalledTimes(1);
    expect(listFormCategoriesRequest).toHaveBeenCalledWith(url, {
      isInCamelCase: true,
    });
  });

  it('calls the correct endpoint with searchQuery param', async () => {
    const searchQuery = 'general';
    const productArea = null;
    const url = generateListCategoriesUrl(searchQuery, productArea);

    const response = await listCategories({ searchQuery, productArea });

    expect(response).toEqual(paginatedFormCategoriesData);
    expect(listFormCategoriesRequest).toHaveBeenCalledTimes(1);
    expect(listFormCategoriesRequest).toHaveBeenCalledWith(url, {
      isInCamelCase: true,
    });
  });

  it('calls the correct endpoint with productArea param', async () => {
    const searchQuery = null;
    const productArea = 'medical';
    const url = generateListCategoriesUrl(searchQuery, productArea);

    const response = await listCategories({ searchQuery, productArea });

    expect(response).toEqual(paginatedFormCategoriesData);
    expect(listFormCategoriesRequest).toHaveBeenCalledTimes(1);
    expect(listFormCategoriesRequest).toHaveBeenCalledWith(url, {
      isInCamelCase: true,
    });
  });

  it('calls the correct endpoint with both params', async () => {
    const searchQuery = 'general';
    const productArea = '1';
    const url = generateListCategoriesUrl(searchQuery, productArea);

    const response = await listCategories({ searchQuery, productArea });

    expect(response).toEqual(paginatedFormCategoriesData);
    expect(listFormCategoriesRequest).toHaveBeenCalledTimes(1);
    expect(listFormCategoriesRequest).toHaveBeenCalledWith(url, {
      isInCamelCase: true,
    });
  });

  it('calls the correct endpoint with neither params for empty strings', async () => {
    const searchQuery = '';
    const productArea = '';
    const url = generateListCategoriesUrl(searchQuery, productArea);

    const response = await listCategories({ searchQuery, productArea });

    expect(response).toEqual(paginatedFormCategoriesData);
    expect(listFormCategoriesRequest).toHaveBeenCalledTimes(1);
    expect(listFormCategoriesRequest).toHaveBeenCalledWith(url, {
      isInCamelCase: true,
    });
  });
});
