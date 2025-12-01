// @flow
import _get from 'lodash/get';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { isInfoEvent } from '@kitman/modules/src/Medical/shared/utils';
import { flatMapV2AnswersToConditions } from '@kitman/modules/src/ConditionalFields/shared/utils';

import type { Organisation } from '@kitman/services/src/services/getOrganisation';
import type {
  IssueOccurrenceRequested,
  IssueStatusEventResponse,
} from '@kitman/common/src/types/Issues';
import type { IssueType } from '@kitman/modules/src/Medical/shared/types';

export const getInvalidFields = (
  organisation: Organisation,
  issue: IssueOccurrenceRequested,
  issueType: IssueType,
  isContinuationIssue: boolean
) => {
  const issueIsAnInjury: boolean = issueType === 'Injury';

  const conditionalFieldsV2 =
    !!window.featureFlags['conditional-fields-v1-stop'];

  const conditionalQuestions = conditionalFieldsV2
    ? flatMapV2AnswersToConditions(issue)
    : issue.conditional_questions;

  let fields = {
    issue_type: issueType,
    athlete_id: issue.athlete_id,
    reported_date: issue.reported_date,
    occurrence_date: issue.occurrence_date,
    examination_date: { examinationDate: issue.examination_date },
    // $FlowIgnoreMe[prop-missing]
    events: issue.events?.map<IssueStatusEventResponse>((event) => ({
      status: event.id,
      date: event.date,
    })),
    side_id: issue.side_id,
    conditional_questions: conditionalQuestions,
    activity_type: issue.activity_type,
  };

  if (isContinuationIssue || !isInfoEvent(issue.activity_type)) {
    delete fields.conditional_questions;
  }

  const coding = !window.featureFlags['emr-multiple-coding-systems']
    ? { [codingSystemKeys.OSICS_10]: issue.osics }
    : issue.coding;

  if (organisation.coding_system_key === codingSystemKeys.OSICS_10) {
    fields = {
      ...fields,
      primary_pathology_id:
        coding[codingSystemKeys.OSICS_10]?.osics_pathology_id,
      side_id: _get(coding, `${codingSystemKeys.OSICS_10}.side_id`, null),
    };
  }

  if (organisation.coding_system_key === codingSystemKeys.ICD) {
    fields = {
      ...fields,
      primary_pathology_id: _get(coding, `${codingSystemKeys.ICD}.id`, null),
    };
  }

  if (organisation.coding_system_key === codingSystemKeys.DATALYS) {
    fields = {
      ...fields,
      primary_pathology_id: _get(
        coding,
        `${codingSystemKeys.DATALYS}.id`,
        null
      ),
    };
  }

  if (
    organisation.coding_system_key === codingSystemKeys.CLINICAL_IMPRESSIONS
  ) {
    fields = {
      ...fields,
      primary_pathology_id: _get(
        coding,
        `${codingSystemKeys.CLINICAL_IMPRESSIONS}.id`,
        null
      ),
      side_id: _get(
        coding,
        `${codingSystemKeys.CLINICAL_IMPRESSIONS}.side_id`,
        null
      ),
    };

    if (
      window.featureFlags['supplemental-recurrence-code'] &&
      issue.occurrence_type === 'recurrence'
    )
      fields = {
        ...fields,
        supplemental_recurrence_id: issue.supplementary_coding,
      };
  }

  if (issueIsAnInjury && !isContinuationIssue) {
    const eventField = {};
    if (issue.activity_type === 'game') {
      eventField.game_id = issue.game_id;
    } else if (issue.activity_type === 'training') {
      eventField.training_session_id = issue.training_session_id;
    }
    fields = {
      ...fields,
      ...eventField,
    };
  }

  if (
    issueIsAnInjury &&
    issue.activity_type !== null &&
    !isContinuationIssue &&
    isInfoEvent(issue.activity_type)
  ) {
    fields = {
      ...fields,
      activity_id: issue.activity_id,
      position_when_injured_id: issue.position_when_injured_id,
    };
    if (window.featureFlags['incomplete-injury-fields']) {
      fields = {
        ...fields,
        injury_mechanism: issue.injury_mechanism_id,
        presentation_type: issue.presentation_type,
        issue_contact_type: issue.issue_contact_type,
      };
    }
  }

  if (window.featureFlags['incomplete-injury-fields'] && issueIsAnInjury) {
    fields = {
      ...fields,
      issue_occurrence_onset_id: issue.issue_occurrence_onset_id,
    };
  }
  return fields;
};

export default getInvalidFields;
