// @flow
import $ from 'jquery';
import type { AthleteFilter } from '../../types';

type Params = {
  assessmentGroupId: number | string,
  assessmentItemId: number | string,
  answerValue: mixed,
  filters?: AthleteFilter,
};

const updateAssessmentFields = ({
  assessmentGroupId,
  assessmentItemId,
  answerValue,
  filters = {},
}: Params): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/assessment_groups/${assessmentGroupId}/items/${assessmentItemId}/bulk_update_answers`,
      contentType: 'application/json',
      data: JSON.stringify({
        answer_value: answerValue,
        filters,
      }),
    })
      .done((athletesGrid) => resolve(athletesGrid))
      .fail(() => reject());
  });
};

export default updateAssessmentFields;
