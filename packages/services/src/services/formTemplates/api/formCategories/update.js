// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { FormCategory } from '@kitman/services/src/services/formTemplates/api/types';

export const generateUpdateFormCategoryByIdUrl = (categoryId: number) =>
  `/forms/categories/${categoryId}`;

const updateFormCategory = async (props: {
  formCategoryId: number,
  categoryName: string,
}): Promise<FormCategory> => {
  const { formCategoryId, categoryName } = props;

  const url = generateUpdateFormCategoryByIdUrl(formCategoryId);

  const { data } = await axios.put(url, {
    name: categoryName,
  });

  return data;
};

export default updateFormCategory;
