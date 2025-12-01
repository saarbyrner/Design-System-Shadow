// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { FormCategory } from '@kitman/services/src/services/formTemplates/api/types';

export const CREATE_FORM_CATEGORY_ROUTE = '/forms/categories';

const createFormCategory = async (props: {
  productArea: string,
  categoryName: string,
}): Promise<FormCategory> => {
  const { productArea, categoryName } = props;

  const { data } = await axios.post(CREATE_FORM_CATEGORY_ROUTE, {
    product_area_id: productArea,
    name: categoryName,
  });

  return data;
};

export default createFormCategory;
