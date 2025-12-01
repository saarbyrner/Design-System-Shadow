import { axios } from '@kitman/common/src/utils/services';

import { formCategoryData } from '@kitman/services/src/services/formTemplates/api/mocks/data/formCategories.mock';
import getFormCategory, {
  generateGetFormCategoryByIdUrl,
} from '@kitman/services/src/services/formTemplates/api/formCategories/get';

describe('get category', () => {
  let getFormCategoryRequest;

  beforeEach(() => {
    getFormCategoryRequest = jest
      .spyOn(axios, 'get')
      .mockResolvedValue({ data: formCategoryData });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const categoryId = 1;
    const url = generateGetFormCategoryByIdUrl(categoryId);

    const response = await getFormCategory({ categoryId });

    expect(response).toEqual(formCategoryData);
    expect(getFormCategoryRequest).toHaveBeenCalledTimes(1);
    expect(getFormCategoryRequest).toHaveBeenCalledWith(url, {
      isInCamelCase: true,
    });
  });
});
