// @flow
import $ from 'jquery';

/*
  Returns an array of squads with position_groups, positions and athletes nested beneath, for example:
  [
    {
      "id": 8,
      "name": "International Squad",
      "position_groups": [{
          "id": 25,
          "name": "Forward",
          "order": 1,
          "positions": [{
            "id": 72,
            "name": "Loose-head Prop",
            "order": 1,
            "athletes": [{
              "id": 1,
              "firstname": "Athlete",
              "lastname": "One",
              "fullname": "Athlete One",
              "shortname": "A. One",
              "user_id": 1,
              "avatar_url": "url_string"
            },
            {
                "id": 2,
                "firstname": "Athlete",
                "lastname": "Two",
                "fullname": "Athlete Two",
                "shortname": "A. Two",
                "user_id": 2,
                "avatar_url": "url_string"
            }
          ]
        }
      ]
    }
  ]

  If athleteList is passed in as true it will return an array of squads with the athletes nested within, for example:
  [
    {
        id: squad_id
        name: 'Squad A Name',
        athletes: [
            {
                id: athlete_id,
                avatar_url: 'url_string',
                fullname: 'Athlete 1 Name'
            },
            {
                id: athlete_id,
                avatar_url: 'url_string',
                fullname: 'Athlete 2 Name'
            }
        ]
    },
    {
        id: squad_id
        name: 'Squad B Name',
        athletes: [
            {
                id: athlete_id,
                avatar_url: 'url_string',
                fullname: 'Athlete 1 Name'
            },
            {
                id: athlete_id,
                avatar_url: 'url_string',
                fullname: 'Athlete 3 Name'
            }
        ]
    },
  ]

  If athleteList is passed in as true and minimalAthleteListData true it will return an array of squads with the athletes with minimal data (just id and fullname) nested within, for example:
  [
    {
        id: squad_id
        name: 'Squad A Name',
        athletes: [
            {
                id: athlete_id,
                fullname: 'Athlete 1 Name'
            },
            {
                id: athlete_id,
                fullname: 'Athlete 2 Name'
            }
        ]
    },
    {
        id: squad_id
        name: 'Squad B Name',
        athletes: [
            {
                id: athlete_id,
                fullname: 'Athlete 1 Name'
            },
            {
                id: athlete_id,
                fullname: 'Athlete 3 Name'
            }
        ]
    },
  ]

  If includePreviousOrganisationInformation is passed in as true it will include previous organisation data for each athlete as:
  [
    {
        id: squad_id
        name: 'Squad A Name',
        athletes: [
            {
                id: athlete_id,
                avatar_url: 'url_string',
                fullname: 'Athlete 1 Name',
                previous_organisation: {
                  has_open_illnesses: true,
                  has_open_injuries: true,
                },
            },
            {
                id: athlete_id,
                avatar_url: 'url_string',
                fullname: 'Athlete 2 Name',
                previous_organisation: {
                  has_open_illnesses: false,
                  has_open_injuries: false,
                },
            }
        ]
    },
  ]

*/

const getSquadAthletes = (
  {
    athleteList = false,
    minimalAthleteListData = false,
    includePreviousOrganisationInformation = false,
    refreshCache = false,
  }: {
    athleteList: boolean,
    minimalAthleteListData: boolean,
    includePreviousOrganisationInformation: boolean,
    refreshCache?: boolean,
  } = {
    athleteList: false,
    minimalAthleteListData: false,
    includePreviousOrganisationInformation: false,
    refreshCache: false,
  }
): Promise<any> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'GET',
      url: athleteList
        ? '/ui/squad_athletes/athlete_list'
        : '/ui/squad_athletes',
      data: {
        minimal: minimalAthleteListData,
        include_previous_organisation_information:
          includePreviousOrganisationInformation,
        ...(athleteList ? {} : { refresh_cache: refreshCache }),
      },
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getSquadAthletes;
