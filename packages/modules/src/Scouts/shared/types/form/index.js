// @flow
import type { ElementTypes } from '@kitman/modules/src/HumanInput/types/forms';

export type Editor = {
  id: number,
  firstname: string,
  lastname: string,
  fullname: string,
};

export type RegistrationStatusable = {
  statusable: boolean,
  default_status?: string,
  custom_status_manager?: string,
};

export type CustomParamType = 'ssn' | 'phone' | 'email' | 'free';

export type CustomParams = {
  columns?: number,
  style?: string,
  icon?: string,
  unit?: string,
  type?: CustomParamType,
};

export type ConditionType =
  | '=='
  | '<='
  | '<'
  | '>'
  | '>='
  | 'and'
  | 'or'
  | 'not'
  | 'in';

export type Condition = {
  element_id: string,
  type: ConditionType,
  value_type: string,
  value: string | number | boolean,
};

export type SelectOption = {
  value: string,
  label: string,
};

export type FormConfig = {
  post_processors?: Array<string>,
  title?: string,
  element_id?: string,
  registration?: RegistrationStatusable,
  text: ?string,
  type?: string,
  data_point?: boolean,
  optional?: boolean,
  custom_params?: CustomParams,
  default_value?: boolean,
  data_source?: string,
  data_source_params?: Array<string>,
  condition?: Condition,
  items?: Array<SelectOption>,
};

export type FormStructureElement = {
  id: number,
  element_type: ElementTypes,
  config: FormConfig,
  visible: boolean,
  order: number,
  form_elements: Array<FormStructureElement>,
};

export type TemplateVersion = {
  id: number,
  name: string,
  version: number,
  created_at: string,
  updated_at: string,
  editor: Editor,
  config: ?FormConfig,
  form_elements: Array<FormStructureElement>,
};

export type FormTemplate = {
  id: number,
  name: string,
  last_template_version: TemplateVersion,
  created_at: string,
  updated_at: string,
};

export type FormStructure = {
  id: number,
  category: string,
  group: string,
  key: string,
  name: string,
  fullname: string,
  form_type: ?string,
  config: ?FormConfig,
  enabled: boolean,
  created_at: string,
  updated_at: string,
  form_template: FormTemplate,
};
