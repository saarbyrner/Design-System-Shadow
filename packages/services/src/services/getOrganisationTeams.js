// @flow
import $ from 'jquery';

export type OrganisationTeam = {
  id: number,
  name: string,
};
export type OrganisationTeams = Array<OrganisationTeam>;

const getOrganisationTeams = (): Promise<OrganisationTeams> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: '/organisation_teams',
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getOrganisationTeams;
