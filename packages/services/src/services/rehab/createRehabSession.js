// @flow
import $ from 'jquery';
import type { ExerciseCreationStructure } from '@kitman/modules/src/Medical/shared/components/RehabTab/types';
import type { IssueType } from '../../../../modules/src/Medical/shared/types';
import convertIssueType from './issueTypeHelper';

const createRehabSession = (
  athleteId: number,
  issueId: ?number,
  issueType: ?IssueType,
  exerciseInstances: Array<ExerciseCreationStructure> = [],
  sessionId: ?number,
  sessionDate: ?string,
  sectionId: ?number,
  maintenance: boolean
): Promise<any> => {
  const sharedData: any = {
    athlete_id: athleteId,
    maintenance,
    exercise_instances: exerciseInstances,
  };

  if (!maintenance && issueType) {
    sharedData.issue_type = convertIssueType(issueType);
  }

  if (!maintenance && issueId != null) {
    sharedData.issue_id = issueId;
  }

  if (sessionId != null) {
    sharedData.session_id = sessionId;
  }

  if (sessionDate != null) {
    sharedData.session_date = sessionDate;
  }

  if (sectionId != null && sharedData.exercise_instances.length > 0) {
    sharedData.exercise_instances[0].section_id = sectionId;
  }
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/medical/rehab/session_exercises`,
      contentType: 'application/json',
      data: JSON.stringify(sharedData),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default createRehabSession;
