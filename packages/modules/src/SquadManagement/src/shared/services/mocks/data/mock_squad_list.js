import { buildLogoPath } from '@kitman/modules/src/LeagueOperations/shared/services/mock_data_utils';

export const data = [
  {
    id: '645235245664daf0f8fccc44',
    name: 'U13',
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
      state: 'Tennessee',
      zipcode: 6782,
    },
    organisations: [
      {
        id: 115,
        logo_path: buildLogoPath('kitman_logo_full_bleed.png'),
        name: 'LA Galaxy',
      },
    ],
    total_athletes: 12,
  },
  {
    id: '6452352401d171f70fdbc431',
    name: 'U14',
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
      state: 'Tennessee',
      zipcode: 6782,
    },
    organisations: [
      {
        id: 115,
        logo_path: buildLogoPath('kitman_logo_full_bleed.png'),
        name: 'LA Galaxy',
      },
    ],
    total_athletes: 12,
  },
  {
    id: '64523524fd7bd4f6e436ef56',
    name: 'U15',
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
      state: 'Tennessee',
      zipcode: 6782,
    },
    organisations: [
      {
        id: 115,
        logo_path: buildLogoPath('kitman_logo_full_bleed.png'),
        name: 'LA Galaxy',
      },
    ],
    total_athletes: 12,
  },
];
export const meta = {
  current_page: 1,
  next_page: null,
  prev_page: null,
  total_pages: 1,
  total_count: 2,
};

export const response = {
  data,
  meta,
};
