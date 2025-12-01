// @flow
import { useState, useEffect } from 'react';
import _unionBy from 'lodash/unionBy';
import _flatten from 'lodash/flatten';
import _isEqual from 'lodash/isEqual';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import type {
  Question as QuestionType,
  IssueOccurrenceRequested,
} from '@kitman/common/src/types/Issues';
import {
  getConditionalFields,
  getFollowUpQuestions,
} from '../../rosters/src/services/getConditionalFields';
import type { Conditions } from '../../rosters/src/services/getConditionalFields';
import {
  getCodingSystemFromIssue,
  getIssueTypeFromPayload,
  getOtherEventFromIssue,
  isInfoEvent,
} from '../utils';

const getInitialAnswers = (issue) =>
  issue.conditional_questions?.map((q) => ({
    question_id: q.id,
    value: q.answer?.value,
  })) || [];

/*
 * This fetches all follow up questions and the questions meeting the issue conditions.
 * Then it merges it with the answered questions.
 *
 * We need to fetch those because the backend does not send un-answered questions despite the requirement
 * of showing them in the product.
 * This should have been implemented on the backend side, but the design choices made it hard to do so.
 *
 * This is hard to understand and not efficient as we run a lot of requests to get the complete list.
 * The long-term plan is to change it to uses custom forms, which will be the unique way of
 * building that kind of form across the product.
 *
 * This has been implemented in a rush as an emergency fix.
 */
const getQuestions = async (issue: IssueOccurrenceRequested) => {
  const isMultipleCodingOn = window.featureFlags['emr-multiple-coding-systems'];

  // 1. We use the answered questions as the base list.
  let questions = issue.conditional_questions || [];

  // 2. Fetch the follow up questions and merge them with the answered questions
  const followUpQuestions = await Promise.all(
    getInitialAnswers(issue).map(async (answer) => {
      if (answer.value) {
        const { questions: answerFollowUpQuestions } =
          await getFollowUpQuestions(answer);
        return answerFollowUpQuestions;
      }
      return [];
    })
  );

  questions = _unionBy(questions, _flatten(followUpQuestions), 'id');
  const coding = getCodingSystemFromIssue(issue);
  const secondaryPathologies = coding?.secondary_pathologies || [];

  const otherEventValue = getOtherEventFromIssue(issue) || '';

  const conditions: Conditions = {
    activity_id: issue.activity_id || null,
    activity_group_id: null,
    published_before: issue.created_at,
    clinical_impression_code: isMultipleCodingOn
      ? issue.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]?.code
      : null,
    osics_classification_id: isMultipleCodingOn
      ? issue.coding[codingSystemKeys.OSICS_10]?.osics_classification_id || null
      : issue.osics.osics_classification_id,
    osics_pathology_id: isMultipleCodingOn
      ? issue.coding[codingSystemKeys.OSICS_10]?.osics_pathology_id || null
      : issue.osics.osics_pathology_id,
    osics_body_area_id: isMultipleCodingOn
      ? issue.coding[codingSystemKeys.OSICS_10]?.osics_body_area_id || null
      : issue.osics.osics_body_area_id,
    event_type_id: issue.activity_type || null,
    illness_onset_id: issue.onset_id || null,
    pathology_codes:
      isMultipleCodingOn && coding
        ? [
            // $FlowIgnore flow should know that coding.code will be a number or undefined
            coding?.code || null,
            // $FlowIgnore secondaryPathologies will be an array
            ...secondaryPathologies.map((pathology) => pathology.record?.code),
          ].filter((val) => typeof val !== 'undefined' && val !== null)
        : [],
    issue_type_name: getIssueTypeFromPayload(issue),
    reported_date: issue.reported_date,
    occurrence_date: issue.occurrence_date,
    other_event_value: isInfoEvent(otherEventValue) ? null : otherEventValue,
  };

  const { questions: rootQuestions } = await getConditionalFields(conditions);

  questions = _unionBy(questions, rootQuestions, 'id');

  return questions;
};

export default (issue: IssueOccurrenceRequested) => {
  const [questions, setQuestions] = useState<Array<QuestionType>>([]);

  useEffect(() => {
    if (
      window.featureFlags['conditional-fields-showing-in-ip'] &&
      !issue.continuation_issue && // Injury Continuations don't have conditional fields
      issue.conditional_questions &&
      !window.featureFlags['conditional-fields-v1-stop'] // stop calling fetchQuestions for v2
    ) {
      getQuestions(issue)
        .then((questionsList) => {
          if (!_isEqual(questions, questionsList)) {
            setQuestions(questionsList);
          }
        })
        .catch(() => {});
    }
  }, [issue]);

  return {
    questions,
  };
};
