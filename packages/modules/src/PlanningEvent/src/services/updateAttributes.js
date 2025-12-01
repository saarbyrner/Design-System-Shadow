// @flow
import $ from 'jquery';
import type { AthleteFilter } from '../../types';

type relatedIssues = {
  related_issue_id?: number,
  related_issue_type?: string,
};
type Params = {
  eventId: number,
  attributes: {
    participation?: number,
    include_in_group_calculations?: boolean,
    rpe?: number,
    duration?: number,
    related_issues?: Array<relatedIssues>,
    related_issue_id?: number,
    related_issue_type?: string,
  },
  athleteId?: ?number,
  filters?: AthleteFilter,
  tab: 'collections_tab' | 'athletes_tab',
};

const updateAttributes = ({
  eventId,
  attributes,
  athleteId = null,
  filters = {},
  tab,
}: Params): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/planning_hub/events/${eventId}/athlete_events/update_attributes`,
      contentType: 'application/json',
      data: JSON.stringify({
        ...attributes,
        athlete_id: athleteId,
        filters,
        tab,
      }),
    })
      .done((athletesGrid) => resolve(athletesGrid))
      .fail(() => reject());
  });
};

export default updateAttributes;
