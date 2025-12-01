// @flow

import { axios } from '@kitman/common/src/utils/services';

import type { FormCategorySelect } from '../types';

export const GET_CATEGORIES_ROUTE = '/ui/forms/form_templates/categories';

const getCategories = async (): Promise<Array<FormCategorySelect>> => {
  const { data } = await axios.get(GET_CATEGORIES_ROUTE, {
    isInCamelCase: true,
  });

  return data;
};

export default getCategories;
