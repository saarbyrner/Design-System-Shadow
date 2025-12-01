// @flow
import { axios } from '@kitman/common/src/utils/services';

export const generateUpdateFormAssignmentsUrl = (formId: number) =>
  `/forms/${formId}/assignments`;

export type UpdateFormAssignmentsRequestBody = {
  athlete_ids_to_add: Array<number>,
  athlete_ids_to_remove: Array<number>,
};

const updateFormAssignments = async ({
  formId,
  requestBody,
}: {
  formId: number,
  requestBody: UpdateFormAssignmentsRequestBody,
}): Promise<void> => {
  const url = generateUpdateFormAssignmentsUrl(formId);
  const { data } = await axios.post(url, requestBody);

  return data;
};

export default updateFormAssignments;
