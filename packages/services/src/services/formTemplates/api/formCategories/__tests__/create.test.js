import { axios } from '@kitman/common/src/utils/services';

import { formCategoryData } from '@kitman/services/src/services/formTemplates/api/mocks/data/formCategories.mock';
import createFormCategory, {
  CREATE_FORM_CATEGORY_ROUTE,
} from '@kitman/services/src/services/formTemplates/api/formCategories/create';

describe('create category', () => {
  let createFormCategoryRequest;

  beforeEach(() => {
    createFormCategoryRequest = jest
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: formCategoryData });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const productArea = '1';
    const categoryName = 'general';

    const response = await createFormCategory({ productArea, categoryName });

    expect(response).toEqual(formCategoryData);
    expect(createFormCategoryRequest).toHaveBeenCalledTimes(1);
    expect(createFormCategoryRequest).toHaveBeenCalledWith(
      CREATE_FORM_CATEGORY_ROUTE,
      { name: categoryName, product_area_id: productArea }
    );
  });
});
