// @flow

import { axios } from '@kitman/common/src/utils/services';

import type { ProductArea } from '../types';

export const GET_PRODUCT_AREAS_URL = '/forms/categories/product_areas';

const getProductAreas = async (): Promise<Array<ProductArea>> => {
  const { data } = await axios.get(GET_PRODUCT_AREAS_URL, {
    isInCamelCase: true,
  });

  return data || [];
};

export default getProductAreas;
