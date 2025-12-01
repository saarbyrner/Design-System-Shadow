// @flow
import { axios } from '@kitman/common/src/utils/services';

import type { FormAssignment } from '@kitman/modules/src/HumanInput/types/forms';

export const GET_FORM_ASSIGNMENTS_ROUTE = '/forms/assignments/search';

export type PaginationMeta = {
  current_page: number,
  next_page: number | null,
  prev_page: number | null,
  total_pages: number,
  total_count: number,
};

const fetchAssignedForms = async (props: {
  formId: ?string,
  formStatus: ?string,
  athleteId?: number,
  page: ?string,
  perPage: ?string,
}): Promise<{ data: Array<FormAssignment>, pagination: PaginationMeta }> => {
  const params = {
    form_id: props.formId,
    status: props.formStatus,
    page: props.page,
    per_page: props.perPage,
    athlete_id: props.athleteId,
  };

  const { data } = await axios.get(GET_FORM_ASSIGNMENTS_ROUTE, { params });

  return data;
};

export default fetchAssignedForms;
