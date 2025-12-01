// @flow
import $ from 'jquery';
import type { AdministrationAthleteData } from '@kitman/common/src/types/Athlete';

let ajaxRequest = null;
const getAdministrationAthleteData = ({
  active,
  search,
  labels,
  athletesPage = 10,
  athletesPerPage = 1,
}: {
  active: boolean,
  search?: string,
  labels: Array<number>,
  athletesPage?: number,
  athletesPerPage?: number,
}): Promise<AdministrationAthleteData> => {
  return new Promise((resolve, reject) => {
    if (ajaxRequest) {
      ajaxRequest.abort();
    }

    ajaxRequest = $.ajax({
      url: '/administration/athletes',
      method: 'GET',
      data: {
        active,
        ...(search && { search }),
        ...(labels && { labels }),
        page: athletesPage,
        per_page: athletesPerPage,
      },
    })
      .done(resolve)
      .fail(reject)
      .always(() => {
        ajaxRequest = null;
      });
  });
};

export default getAdministrationAthleteData;
