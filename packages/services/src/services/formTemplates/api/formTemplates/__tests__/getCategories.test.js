import { axios } from '@kitman/common/src/utils/services';

import { formCategoriesSelectMock } from '@kitman/services/src/services/formTemplates/api/mocks/data/formTemplates/getCategories';
import getCategories, { GET_CATEGORIES_ROUTE } from '../getCategories';

describe('getCategories', () => {
  let getCategoriesRequest;

  beforeEach(() => {
    getCategoriesRequest = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const returnedData = await getCategories();

    expect(returnedData).toEqual(formCategoriesSelectMock);
    expect(getCategoriesRequest).toHaveBeenCalledTimes(1);
    expect(getCategoriesRequest).toHaveBeenCalledWith(GET_CATEGORIES_ROUTE, {
      isInCamelCase: true,
    });
  });
});
