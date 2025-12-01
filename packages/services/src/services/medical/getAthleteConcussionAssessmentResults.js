// @flow
import $ from 'jquery';
import type { IssueType } from '@kitman/modules/src/Medical/shared/types';
import type { ConcussionAssessmentResultType } from '@kitman/modules/src/Medical/shared/types/medical/ConcussionAssessmentResult';

export type AthleteConcussionAssessmentResults = Array<Object>;

const getAthleteConcussionAssessmentResults = (
  athleteId: number,
  issueId: number,
  type: IssueType,
  resultType: ConcussionAssessmentResultType = 'assessments'
): Promise<AthleteConcussionAssessmentResults> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/medical/athletes/${athleteId}/${
        type === 'Injury' ? 'injuries' : 'illnesses'
      }/${issueId}/concussions/${resultType}`,
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getAthleteConcussionAssessmentResults;
