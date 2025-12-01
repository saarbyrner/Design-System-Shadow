// @flow
import $ from 'jquery';

export type InjuryStatus = {
  id: number,
  injury_status_system_id: number,
  description: string,
  color: string,
  restore_availability: boolean,
  cause_unavailability: boolean,
  order: number,
  is_resolver: boolean,
};

export type InjuryStatuses = Array<InjuryStatus>;

const getInjuryStatuses = (): Promise<InjuryStatuses> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/injury_statuses',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getInjuryStatuses;
