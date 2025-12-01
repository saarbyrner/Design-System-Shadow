// @flow
import $ from 'jquery';
import type { IssueType } from '../../../../modules/src/Medical/shared/types';
import convertIssueType from './issueTypeHelper';

export type linkMaintenanceExercise = {
  athlete_id: number,
  issue_type: IssueType,
  issue_id: number,
  exercise_instances_ids: Array<number>,
};

const linkMaintenanceExerciseToSession = (
  data: linkMaintenanceExercise
): Promise<Array<any>> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/medical/rehab/session_exercises/link`,
      contentType: 'application/json',
      data: JSON.stringify({
        ...data,
        issue_type: convertIssueType(data.issue_type),
      }),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default linkMaintenanceExerciseToSession;
