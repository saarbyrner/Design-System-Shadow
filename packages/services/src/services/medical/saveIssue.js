// @flow
import $ from 'jquery';
import type { IssueOccurrenceRequested } from '@kitman/common/src/types/Issues';
import type { IssueType } from '@kitman/modules/src/Medical/shared/types';

export type conditionalFieldsAnswer = {
  question_id: number,
  value: string,
};

type UpdatedLinkedChronicIssue = {
  id: number,
};

/*
 * This is mostly copyied from:
 * athleteInjury/athleteIssueEditor/src/utils.js
 *
 * The plan is to create simpler services for updating issues
 * The refactored services would not require those transformations
 */
export const transformIssueRequest = (
  issueData: IssueOccurrenceRequested,
  formType: IssueType
) => {
  const formData = Object.assign({}, issueData);

  const pathology = formData?.coding?.pathologies?.[0];

  if (pathology?.id) {
    formData.coding.pathologies = [
      {
        id: pathology.id,
        code: pathology.code,
        name: pathology.name,
        coding_system_side_id:
          pathology.coding_system_side?.coding_system_side_id,
      },
    ];
  }

  /*
   * the notes field does not expect existing note,
   * it only expects new notes
   */
  formData.notes = [];

  // This attribute should not be added to the body params of the request
  delete formData.activity;

  /*
   * Remove attributes that are not needed for illnesses
   */
  if (formType === 'Illness') {
    delete formData.activity_id;
    delete formData.activity_type;
    delete formData.game_id;
    delete formData.training_session_id;
    delete formData.occurrence_min;
    delete formData.session_completed;
    delete formData.position_when_injured_id;
    delete formData.bamic_grade_id;
    delete formData.bamic_site_id;

    /*
     * In order to prevent conflict with the already existing Illness types on the backend
     * We need to rename type_id to onset_id when the issue is an illness.
     */
    formData.onset_id = issueData.type_id;
  }

  if (formType === 'Injury') {
    formData.issue_occurrence_onset_id =
      issueData.issue_occurrence_onset_id || issueData.type_id;
    delete formData.type_id;
  }

  if (issueData.linked_issues && issueData.linked_issues.length > 0) {
    const newLinkedIssues = issueData.linked_issues
      .filter((linkedIssue) => linkedIssue !== null)
      .reduce(
        (acc, curr) => {
          const arrayToPush =
            curr.issue_type === 'Injury' ? 'injuries' : 'illnesses';
          const newObj = { ...acc };

          newObj[arrayToPush].push(curr.id);

          return newObj;
        },
        {
          injuries: [],
          illnesses: [],
        }
      );

    formData.linked_issues = {
      ...newLinkedIssues,
    };
  }

  /*
   * Makes sure that we send back existing conditional field answers,
   * otherwise, they get deleted
   */
  if (
    window.featureFlags['conditional-fields-showing-in-ip'] &&
    issueData.conditional_questions
  ) {
    formData.conditional_fields_answers = issueData.conditional_questions
      ?.filter((q) => Boolean(q.answer?.value))
      ?.map<conditionalFieldsAnswer>((q) => ({
        question_id: q.id,
        value: q.answer.value,
      }));
  }

  /*
   * Makes sure that we are mutating the linked_chronic_issues to be what the
   * backend is expecting
   */
  if (issueData?.linked_chronic_issues?.length)
    formData.linked_chronic_issues =
      issueData.linked_chronic_issues.map<UpdatedLinkedChronicIssue>(
        (issue) => ({
          id: issue.chronic_issue?.id,
        })
      );

  if (formData.supplementary_pathology) {
    formData.has_supplementary_pathology = true;
  }

  return formData;
};

const generateEndpointUrl = (issueType, issue, isChronicIssue) => {
  if (isChronicIssue) {
    return `/athletes/${issue.athlete_id}/chronic_issues/${issue.id}`;
  }
  if (issueType === 'Injury') {
    return `/athletes/${issue.athlete_id}/injuries/${issue.id}`;
  }
  return `/athletes/${issue.athlete_id}/illnesses/${issue.id}`;
};

const saveIssue = (
  issueType: IssueType,
  issue: IssueOccurrenceRequested,
  attributesToSave: Object,
  isChronicIssue: boolean = false
): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const payload = {
        detailed: true,
        scope_to_org: true,
        ...transformIssueRequest(issue, issueType),
        ...attributesToSave,
        // the BE doesn't do anything with rehab_sessions value (will not remove it),
        // and if there are a lot of them it slows the request/response
        // dramatically. Removing all rehab_sessions will hopefully speed things up.
        rehab_sessions: null,
        include_occurrence_type: true,
      };

      if (issueType === 'Injury') {
        delete payload.type_id;
      }

      const endpointUrl = generateEndpointUrl(issueType, issue, isChronicIssue);

      $.ajax({
        method: 'PUT',
        contentType: 'application/json',
        url: endpointUrl,
        data: JSON.stringify(payload),
      })
        .done((data) => resolve(data))
        .fail((jqXHR) => {
          reject(jqXHR || new Error('Unknown AJAX error'));
        });
    } catch (syncError) {
      reject(syncError);
    }
  });
};

export default saveIssue;
