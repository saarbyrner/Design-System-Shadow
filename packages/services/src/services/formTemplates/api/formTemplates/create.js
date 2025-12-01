// @flow

import { axios } from '@kitman/common/src/utils/services';
import type { FormType } from '@kitman/modules/src/FormTemplates/shared/types';
import type {
  HumanInputFormElementConfig,
  HumanInputFormTemplateVersion,
  ElementTypes,
  HumanInputFormElement,
  HumanInputFormTemplateVersionConfig,
} from '@kitman/modules/src/HumanInput/types/forms';

export const CREATE_FORM_TEMPLATES_URL = '/forms/form_templates';

export type CreateFormTemplatesForm = $Exact<{
  category: string,
  group: string,
  form_type: FormType,
  key: string,
  name: string,
  fullname: string,
  config: HumanInputFormTemplateVersionConfig | null,
  enabled: true,
}>;

export type CreateFormTemplateHumanInputFormElement = {
  config: HumanInputFormElementConfig,
  element_type: ElementTypes,
  form_elements?: Array<CreateFormTemplateHumanInputFormElement>,
  visible: boolean,
};

export type CreateFormTemplateRequestBody = $Exact<{
  form: CreateFormTemplatesForm,
  form_template: { name: string },
  form_template_version: {
    name: string,
    config: HumanInputFormTemplateVersionConfig | null,
    form_elements: Array<HumanInputFormElement>,
  },
  form_elements: Array<HumanInputFormElement>,
  form_category_id: number,
}>;

export type CreateFormTemplateReturnType = $Exact<{
  ...CreateFormTemplatesForm,
  id: number,
  created_at: string,
  updated_at: string,
  form_template: {
    id: number,
    name: string,
    last_template_version: HumanInputFormTemplateVersion,
  },
  last_submitted: { [userId: number]: string }, // Example: {1: '2022-08-04T00:00:00Z'}
  form_category: {
    id: number,
    name: string,
    product_area: string,
    product_area_id: number,
  },
}>;

const create = async (
  requestBody: CreateFormTemplateRequestBody
): Promise<CreateFormTemplateReturnType> => {
  const { data } = await axios.post(CREATE_FORM_TEMPLATES_URL, requestBody);
  return data;
};
export default create;
