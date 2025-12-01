// @flow

import { axios } from '@kitman/common/src/utils/services';

import type { MetaCamelCase, FormTemplate } from '../types';

export const SEARCH_FORM_TEMPLATES_URL = '/forms/form_templates/search';

export type SearchFormTemplatesRequestBody = {
  searchQuery: string,
  filters: {
    category?: string,
    formCategoryId?: number,
    squadId?: number,
  },
  pagination: {
    page?: number,
    perPage?: number,
  },
};

export type SearchFormTemplatesResponse = {
  data: Array<FormTemplate>,
  meta: MetaCamelCase,
};

const search = async (
  requestBody: SearchFormTemplatesRequestBody
): Promise<SearchFormTemplatesResponse> => {
  const { data } = await axios.post(SEARCH_FORM_TEMPLATES_URL, {
    ...requestBody,
    isInCamelCase: true,
  });
  return data;
};
export default search;
