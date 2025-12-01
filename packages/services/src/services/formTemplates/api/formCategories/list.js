// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { FormCategories } from '@kitman/services/src/services/formTemplates/api/types';
import type { PaginationMeta } from '@kitman/services/src/services/humanInput/api/assignedForms/fetchAssignedForms';

export const generateListCategoriesUrl = (
  searchQuery?: string,
  productArea?: string,
  includeDeleted?: boolean,
  pagination?: { per_page?: number, page?: number }
) => {
  if (searchQuery || productArea || pagination?.per_page || pagination?.page || includeDeleted) {
    const urlParams = new URLSearchParams();
    if (searchQuery) {
      urlParams.append('search_query', searchQuery);
    }
    if (productArea) {
      urlParams.append('product_area_id', productArea);
    }
    if (includeDeleted) {
      urlParams.append('include_deleted', includeDeleted.toString());
    }
    if (pagination?.per_page) {
      urlParams.append('per_page', pagination.per_page.toString());
    }
    if (pagination?.page) {
      urlParams.append('page', pagination.page.toString());
    }
    return `/forms/categories?${urlParams.toString()}`;
  }

  return `/forms/categories`;
};

const listFormCategories = async (props: {
  searchQuery?: string,
  productArea?: string,
  includeDeleted?: boolean,
  pagination?: { per_page?: number, page?: number },
}): Promise<{
  form_categories: Array<FormCategories>,
  pagination: PaginationMeta,
}> => {
  const url = generateListCategoriesUrl(
    props.searchQuery,
    props.productArea,
    props.includeDeleted,
    props.pagination
  );

  const { data } = await axios.get(url, {
    isInCamelCase: true,
  });

  return data;
};

export default listFormCategories;
