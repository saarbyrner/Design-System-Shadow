// @flow
import $ from 'jquery';
import type { AssessmentGroup } from '../../types';

export default function saveAssessmentDetails(
  assessmentId: number | string,
  name: string
): Promise<Array<AssessmentGroup>> {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'PUT',
      url: `/assessment_groups/${assessmentId}`,
      contentType: 'application/json',
      data: JSON.stringify({
        name,
      }),
    })
      .done((response) => {
        resolve(response);
      })
      .fail(() => {
        reject();
      });
  });
}
