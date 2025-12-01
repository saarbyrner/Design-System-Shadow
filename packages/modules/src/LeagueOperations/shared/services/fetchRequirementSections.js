/* eslint-disable camelcase */
// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { PaginatedResponse, RequirementSection } from '../types/common';

import wrapInPaginatedResponse from './utils';

export type Filters = {
  search_expression: string,
  per_page: number,
  page: number,
};

export type RequestParams = Filters & {
  registration_id: number,
  user_id: number,
};

const fetchRequirementSections = async ({
  registration_id,
  user_id,
  search_expression,
  per_page,
  page,
}: RequestParams): Promise<PaginatedResponse<RequirementSection>> => {
  try {
    const { data } = await axios.post(
      `/registration/registrations/${registration_id}/sections/search`,
      {
        user_id,
        search_expression,
        per_page,
        page,
      }
    );

    return wrapInPaginatedResponse({ data });
  } catch (err) {
    throw new Error(err);
  }
};

export default fetchRequirementSections;
