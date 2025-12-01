import { axios } from '@kitman/common/src/utils/services';

import deleteFormCategory, {
  generateDeleteFormCategoryByIdUrl,
} from '@kitman/services/src/services/formTemplates/api/formCategories/delete';

describe('delete category', () => {
  let deleteFormCategoryRequest;

  beforeEach(() => {
    deleteFormCategoryRequest = jest
      .spyOn(axios, 'delete')
      .mockResolvedValue({ data: null });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const categoryId = 1;
    const url = generateDeleteFormCategoryByIdUrl(categoryId);

    const response = await deleteFormCategory({ categoryId });

    expect(response).toEqual(null);
    expect(deleteFormCategoryRequest).toHaveBeenCalledTimes(1);
    expect(deleteFormCategoryRequest).toHaveBeenCalledWith(url);
  });
});
