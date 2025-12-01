// @flow
import { axios } from '@kitman/common/src/utils/services';
import type { ConditionWithQuestions } from '@kitman/modules/src/ConditionalFields/shared/types';

export type ConditionRequest = {
  activity_id: ?number,
  activity_group_id: ?number,
  clinical_impression_code: ?number,
  osics_classification_id: ?string,
  osics_pathology_id: ?string,
  osics_body_area_id: ?string,
  event_type_id: ?string,
  illness_onset_id: ?number,
  published_before: ?string,
  pathology_codes: Array<?number | ?string>,
  issue_type_name: ?string,
  issue_class_name: 'illness' | 'injury',
  athlete_id: number,
};

export type RequestResponse = {
  conditions: ConditionWithQuestions,
};

const getConditionalFieldsForm = async (
  conditions: ConditionRequest
): Promise<RequestResponse> => {
  const { data } = await axios.post(
    '/conditional_fields/matching_questions',
    conditions
  );

  return data;
};

export default getConditionalFieldsForm;
