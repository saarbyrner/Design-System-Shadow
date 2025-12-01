import { buildLogoPath } from '@kitman/modules/src/LeagueOperations/shared/services/mock_data_utils';

const genericData = {
  total_athletes: 10,
  total_coaches: 27,
  markers: {
    start_season: '2023-02-17T14:33:01.620Z',
    in_season: '2023-02-15T17:33:01.620Z',
    end_season: '2023-11-03T14:33:01.620Z',
  },
  address: {
    id: '64523524a609c745dbaca047',
    city: 'Cazadero',
    country: {
      abbreviation: 'AS',
      name: 'Guadeloupe',
      id: '645235246f06ace5b28ae7ca',
    },
    line_1: 679,
    line_2: 'Elm Avenue',
    line_3: 'Coleridge Street',
    state: 'New Mock',
    zipcode: 6782,
  },
  organisations: [
    {
      id: 115,
      logo_path: buildLogoPath('kitman_logo_full_bleed.png'),
      name: 'LA Mockaxy',
    },
  ],
  divisions: [
    {
      id: 1,
      name: 'KLS',
    },
  ],
};

export const data = [
  {
    id: 1,
    name: 'U13',
    ...genericData,
  },
  {
    id: 2,
    name: 'U14',
    ...genericData,
  },
  {
    id: 3,
    name: 'U15',
    ...genericData,
  },
  {
    id: 4,
    name: 'U16',
    ...genericData,
  },

  {
    id: 5,
    name: 'U17',
    ...genericData,
  },

  {
    id: 6,
    name: 'U19',
    ...genericData,
  },
];

export const response = data;
