// @flow
import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import type { Option } from '@kitman/components/src/Select';
import getAthleteAssessments from '../../rosters/src/services/getAthleteAssessments';
import type {
  AthleteAssessment,
  AssessmentType,
} from '../../rosters/src/services/getAthleteAssessments';

const useAthleteAssessments = (
  athleteId: ?number,
  assessmentType?: AssessmentType
) => {
  const [athleteAssessmentOptions, setAthleteAssessmentOptions] = useState<
    Array<Option>
  >([]);

  const createAssessmentDropdownOptions = (
    fetchedAssessments: Array<AthleteAssessment>
  ): Array<Option> => {
    return fetchedAssessments.map((assessment) => {
      return {
        label: `${assessment.form.name} ${moment(assessment.date).format(
          'MMM DD, YYYY'
        )}`,
        value: assessment.id,
      };
    });
  };

  const fetchAthleteAssessments = (
    selectedAthleteId: number,
    selectedAssessmentType?: AssessmentType
  ): Promise<any> =>
    new Promise<void>((resolve: (value: any) => void, reject) =>
      getAthleteAssessments(selectedAthleteId, selectedAssessmentType).then(
        (assessments) => {
          setAthleteAssessmentOptions(
            createAssessmentDropdownOptions(assessments)
          );
          resolve();
        },
        () => reject()
      )
    );

  useEffect(() => {
    if (!athleteId) {
      return;
    }

    fetchAthleteAssessments(athleteId, assessmentType);
  }, [athleteId]);

  return {
    athleteAssessmentOptions,
    fetchAthleteAssessments,
  };
};

export default useAthleteAssessments;
