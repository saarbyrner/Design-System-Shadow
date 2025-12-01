// @flow
import { axios } from '@kitman/common/src/utils/services';
import type {
  CreateFormTemplateRequestBody,
  CreateFormTemplateReturnType,
} from '@kitman/services/src/services/formTemplates/api/formTemplates/create';

export const generateUpdateFormTemplatetUrl = (formTemplateId: number) =>
  `/forms/form_templates/${formTemplateId}`;

export type UpdateFormTemplateRequestBody = {
  ...CreateFormTemplateRequestBody,
};

export type UpdateFormTemplateReturnType = {
  ...CreateFormTemplateReturnType,
};
const updateFormTemplate = async ({
  formTemplateId,
  requestBody,
}: {
  formTemplateId: number,
  requestBody: UpdateFormTemplateRequestBody,
}): Promise<UpdateFormTemplateReturnType> => {
  const url = generateUpdateFormTemplatetUrl(formTemplateId);
  const { data } = await axios.put(url, requestBody);

  return data;
};

export default updateFormTemplate;
