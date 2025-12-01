// @flow
import $ from 'jquery';
import type { AthletePolicy } from '@kitman/common/src/types/Athlete';

const getAthletesPolicies = (
  areAthletesActive?: boolean = true,
  searchQuery?: string
): Promise<AthletePolicy[]> => {
  return new Promise((resolve, reject) => {
    const activeParam = areAthletesActive ? '1' : '0';
    const searchParam = searchQuery ? `&search=${searchQuery}` : '';

    $.ajax({
      method: 'GET',
      url: `/ui/settings/athletes/export_policies?active=${activeParam}${searchParam}`,
      contentType: 'application/json',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getAthletesPolicies;
