// @flow
import $ from 'jquery';

import type { RegistrationDetails } from '@kitman/modules/src/LeagueOperations/technicalDebt/types';

export type CurrentUserData = {
  firstname: string,
  id: number,
  lastname: string,
  username: string,
  fullname: string,
  email: string,
  registration?: RegistrationDetails,
  is_athlete: boolean,
  role: string,
};

const getCurrentUser = (): Promise<CurrentUserData> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/ui/current_user',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getCurrentUser;
