// @flow
import $ from 'jquery';

import type { AthleteFilter } from '../../types';

type Params = {
  eventId: number,
  nextId: ?number,
  filters: ?AthleteFilter,
  assessmentGroupId: number,
};

export default function fetchAssessmentGrid({
  eventId,
  nextId,
  filters,
  assessmentGroupId,
}: Params): Promise<Object> {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${eventId}/collections/assessments`,
      contentType: 'application/json',
      data: JSON.stringify({
        assessment_group_id: assessmentGroupId,
        next_id: nextId || null,
        filters,
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
