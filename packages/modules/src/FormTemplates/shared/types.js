// @flow

import type {
  HumanInputFormTemplateVersion,
  HumanInputFormElement,
  HumanInputFormTemplateVersionConfig,
} from '@kitman/modules/src/HumanInput/types/forms';
import { formTypeEnumLike } from './enum-likes';

export type FormType = $Values<typeof formTypeEnumLike>;

export type NewFormTemplate = {
  id: number,
  name: string,
  form_elements: Array<HumanInputFormElement>,
  config: null | HumanInputFormTemplateVersionConfig,
};

export type FormStructure = HumanInputFormTemplateVersion | NewFormTemplate;
