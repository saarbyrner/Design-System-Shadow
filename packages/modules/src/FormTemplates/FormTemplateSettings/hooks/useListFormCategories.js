// @flow

import type {
  FormCategories,
  MetaCamelCase,
} from '@kitman/services/src/services/formTemplates/api/types';
import { useListFormCategoriesQuery } from '@kitman/services/src/services/formTemplates';
import { useSelector } from 'react-redux';
import { getFormTemplateSettingsFilters } from '@kitman/modules/src/FormTemplates/redux/selectors/formTemplateSettingsSelectors';
import { type CustomHookReturnType } from '@kitman/common/src/hooks/useGlobalAppBasicLoader';

const initialMeta: MetaCamelCase = {
  currentPage: 0,
  nextPage: 0,
  prevPage: 0,
  totalCount: 0,
  totalPages: 0,
};

export const initialData = {
  formCategories: [],
  pagination: initialMeta,
};

export const useListFormCategories = (
  currentPage: number,
  rowsPerPage: number
): {
  rows: FormCategories,
  meta: MetaCamelCase,
  ...$Exact<CustomHookReturnType>,
} => {
  const filters = useSelector(getFormTemplateSettingsFilters);
  let productAreaForQuery: ?string | Array<string> = null;

  if (filters?.productArea) {
    if (Array.isArray(filters.productArea)) {
      // Temporary: Use the first selected product area if multiple are selected, as backend expects one.
      productAreaForQuery =
        filters.productArea.length > 0 ? filters.productArea[0] : null;
    } else {
      productAreaForQuery = filters.productArea;
    }
  }

  const searchQueryForQuery = filters?.searchQuery || '';

  const {
    data = initialData,
    isLoading,
    isSuccess,
    isError,
  }: {
    data: {
      formCategories: FormCategories,
      pagination: MetaCamelCase,
    },
    isLoading: boolean,
    isSuccess: boolean,
    isError: boolean,
  } = useListFormCategoriesQuery({
    pagination: {
      page: currentPage,
      per_page: rowsPerPage,
    },
    productArea: productAreaForQuery,
    searchQuery: searchQueryForQuery,
  });

  const rows = data.formCategories || [];
  const meta = data.pagination || initialMeta;

  return { isLoading, isSuccess, isError, rows, meta };
};

export default useListFormCategories;
