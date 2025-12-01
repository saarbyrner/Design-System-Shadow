// @flow
import $ from 'jquery';

export type AssessmentType = 'scat5';
export type AthleteAssessment = {
  date: string,
  id: number,
  form: {
    category: string,
    created_at: string,
    enabled: true,
    group: AssessmentType,
    id: number,
    key: string,
    name: string,
    updated_at: string,
  },
};
export type AthleteAssessmentList = Array<AthleteAssessment>;

const getAthleteAssessments = (
  athleteId: number,
  assessmentType?: AssessmentType
): Promise<AthleteAssessmentList> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: `/ui/concussion/assessments?athlete_id=${athleteId}&group=${
        assessmentType || ''
      }`,
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getAthleteAssessments;
