// @flow
import $ from 'jquery';
import type {
  UpdateRehabExercise,
  RehabSession,
} from '@kitman/modules/src/Medical/shared/components/RehabTab/types';
import convertIssueType from './issueTypeHelper';

const updateExercise = (
  updatedExercise: UpdateRehabExercise
): Promise<Array<RehabSession>> => {
  const issueId = updatedExercise.issue_id || undefined;
  const issueType = convertIssueType(updatedExercise.issue_type);
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PUT',
      url: `/ui/medical/rehab/session_exercises`,
      contentType: 'application/json',
      data: JSON.stringify({
        ...updatedExercise,
        issue_id: issueId,
        issue_type: issueType,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(reject);
  });
};

export default updateExercise;
