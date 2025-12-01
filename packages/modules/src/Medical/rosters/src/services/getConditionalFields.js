// @flow
import $ from 'jquery';
import type { ConditionalFieldAnswer } from '../../../shared/types';

export type Question = {
  id: number,
  parent_question_id: ?number,
  question: string,
  question_type: 'multiple-choice' | 'free-text',
  order: number,
  question_metadata: Array<{ value: string, order: number }>,
  answer: { id: number, value: string },
};
export type Conditions = {
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
};

export const getFollowUpQuestions = (
  answer: ConditionalFieldAnswer
): Promise<{ questions: Array<Question> }> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/ui/conditional_fields/fetch_followup_questions',
      data: { question_id: answer.question_id, answer: answer.value },
    })
      .done(resolve)
      .fail(reject);
  });
};

export const getConditionalFields = (
  conditions: Conditions
): Promise<{ questions: Array<Question> }> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: '/ui/conditional_fields/fetch_questions',
      data: conditions,
    })
      .done(resolve)
      .fail(reject);
  });
};
