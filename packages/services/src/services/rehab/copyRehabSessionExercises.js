// @flow
import $ from 'jquery';
import type { RehabSession } from '../../../../modules/src/Medical/shared/components/RehabTab/types';
import type { IssueType } from '../../../../modules/src/Medical/shared/types';
import convertIssueType from './issueTypeHelper';

export type SessionExerciseCopyData = {
  athlete_id: number,
  exercise_instances_ids: Array<number>,
  destination_session_ids?: Array<number>, // Optional if session date is provided
  destination_session_dates?: Array<string>, // Optional if destination_session_ids is provided
  issue_type?: ?IssueType, // Optional if destination_session_ids provided. NOTE: Backend requires lowercase
  issue_id?: ?number, // Optional if destination_session_id provided.
  insert_order_index?: ?number,
  copy_comments?: boolean,
  compressed?: boolean,
  maintenance?: ?boolean,
};

const copyRehabSessionExercises = (
  data: SessionExerciseCopyData
): Promise<Array<RehabSession>> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/medical/rehab/session_exercises/copy`,
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

export default copyRehabSessionExercises;
