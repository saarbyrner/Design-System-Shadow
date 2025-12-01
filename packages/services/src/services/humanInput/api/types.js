// @flow

import type {
  ValueTypes,
  FormStatus,
} from '@kitman/modules/src/HumanInput/types/forms';

export type Answer = {
  form_element_id: number,
  value: ValueTypes,
};

type FormAnswersSet = {
  id: number,
};

export type FormUpdateRequestBody = {
  form_answers_set: FormAnswersSet,
  answers: Array<Answer>,
  isSavingProgress?: boolean,
  status: FormStatus,
};

export type FormType = {
  category: string,
  config: ?any,
  created_at: string,
  enabled: boolean,
  form_type: string,
  fullname: ?string,
  group: string,
  id: number,
  key: string,
  name: string,
  updated_at: string,
};

export type BulkCreateFormAnswersSetRequestBody = {
  formId: number,
  userId: number,
  status: FormStatus,
  answers: Array<Answer>,
  organisationId?: number,
};

export type GuardianUser = {
  id: number,
  name: string,
  first_name: string,
  surname: string,
  email: string,
  created_at: string,
};

export type FetchGuardiansResponse = Array<GuardianUser>;

type BaseGuardianBody = {
  athleteId: number,
  first_name: string,
  surname: string,
  email: string,
};

export type CreateGuardianResponse = BaseGuardianBody & {
  id: number,
};

export type CreateGuardianRequestBody = BaseGuardianBody;

export type UpdateGuardianResponse = BaseGuardianBody & {
  id: number,
};

export type UpdateGuardianRequestBody = BaseGuardianBody & {
  id: number,
};

// This will be updated when the backend endpoint is ready
export type DeleteGuardianResponse = {
  id: number,
};

export type DeleteGuardianRequestBody = BaseGuardianBody & {
  id: number,
};

export type Mode = 'create' | 'edit';
