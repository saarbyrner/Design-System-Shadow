import { axios } from '@kitman/common/src/utils/services';

import { formCategoryData } from '@kitman/services/src/services/formTemplates/api/mocks/data/formCategories.mock';
import updateFormCategory, {
  generateUpdateFormCategoryByIdUrl,
} from '@kitman/services/src/services/formTemplates/api/formCategories/update';

describe('update category', () => {
  let updateFormCategoryRequest;

  beforeEach(() => {
    updateFormCategoryRequest = jest
      .spyOn(axios, 'put')
      .mockResolvedValue({ data: formCategoryData });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const formCategoryId = 1;
    const categoryName = 'general';
    const url = generateUpdateFormCategoryByIdUrl(formCategoryId);

    const response = await updateFormCategory({
      formCategoryId,
      categoryName,
    });

    expect(response).toEqual(formCategoryData);
    expect(updateFormCategoryRequest).toHaveBeenCalledTimes(1);
    expect(updateFormCategoryRequest).toHaveBeenCalledWith(url, {
      name: categoryName,
    });
  });
});
