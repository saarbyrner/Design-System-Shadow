// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { CreateFormTemplateReturnType } from '@kitman/services/src/services/formTemplates/api/formTemplates/create';

export const generateUpdateFormTemplateMetadatatUrl = (
  formId: number,
  formTemplateId: number
) => `/forms/${formId}/form_templates/${formTemplateId}/update_form_only`;

export type UpdateFormTemplateMetadataRequestBody = {
  name: ?string,
  fullname: ?string,
  form_category_id: ?number,
  category: ?string,
};

export type UpdateFormTemplateReturnType = { ...CreateFormTemplateReturnType };

const updateFormTemplateMetadata = async ({
  formId,
  formTemplateId,
  requestBody,
}: {
  formId: number,
  formTemplateId: number,
  requestBody: UpdateFormTemplateMetadataRequestBody,
}): Promise<UpdateFormTemplateReturnType> => {
  const url = generateUpdateFormTemplateMetadatatUrl(formId, formTemplateId);
  const { data } = await axios.put(url, requestBody);

  return data;
};

export default updateFormTemplateMetadata;
