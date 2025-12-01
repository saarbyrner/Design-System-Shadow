// @flow
import $ from 'jquery';

export type AthleteIssueStatus = {
  id: number,
  injury_status_system_id: number,
  description: string,
  order: number,
  color: string,
  cause_unavailability: boolean,
  restore_availability: boolean,
  is_resolver: boolean,
};
export type AthleteIssueStatuses = Array<AthleteIssueStatus>;

const getAthleteIssueStatuses = (): Promise<AthleteIssueStatuses> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/medical/issues/injury_statuses',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getAthleteIssueStatuses;
