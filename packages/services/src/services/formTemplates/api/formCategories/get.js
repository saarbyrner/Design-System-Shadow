// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { FormCategory } from '@kitman/services/src/services/formTemplates/api/types';

export const generateGetFormCategoryByIdUrl = (categoryId: number) =>
  `/forms/categories/${categoryId}`;

const getFormCategory = async (props: {
  categoryId: number,
}): Promise<FormCategory> => {
  const url = generateGetFormCategoryByIdUrl(props.categoryId);

  const { data } = await axios.get(url, {
    isInCamelCase: true,
  });

  return data;
};

export default getFormCategory;
