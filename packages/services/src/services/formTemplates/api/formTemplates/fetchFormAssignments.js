// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { Athlete } from '@kitman/common/src/types/Athlete';

export const generateFetchFormAssignmentsUrl = (formId: number) =>
  `/forms/${formId}/assignments`;

export type FormAssignmentsResponse = {
  athlete_ids: Array<number>,
  athletes: Array<Athlete>,
};
const fetchFormAssignments = async (
  formId: number
): Promise<FormAssignmentsResponse> => {
  const url = generateFetchFormAssignmentsUrl(formId);
  const { data } = await axios.get(url, {
    headers: { Accept: 'application/json' },
  });

  return data;
};

export default fetchFormAssignments;
