import { buildLogoPath } from '@kitman/modules/src/LeagueOperations/shared/services/mock_data_utils';

export const data = [
  {
    id: '645235245664daf0f8fccc44',
    user_id: '1233',
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
      line_3: 'Coleredge Street',
      state: 'Tennessee',
      zipcode: 6782,
    },
    place_of_birth: 'Cazadero',
    avatar_url: buildLogoPath('kitman-staff.png'),
    firstname: 'Latasha',
    middlename: 'Marie',
    lastname: 'Christian',
    gender: 'Female',
    email: 'latasha.christian@gmail.com',
    user_title: 'Head Coach',
    affix: 'Mr',
    organisations: [
      {
        id: 115,
        logo_full_path: buildLogoPath('kitman_logo_full_bleed.png'),
        name: 'LA Galaxy',
      },
    ],
    payment_status: false,
    registration_status: {
      id: null,
      status: 'pending_organisation',
      registration_status_reason: null,
    },
    registration_system_status: {
      id: 9,
      name: 'Pending League',
      type: 'pending_league',
    },
    permission_group: 'permission_group',
    ussf_license_id: '123456789',
    mobile_number: '+1 123 456 7891',
    date_of_birth: '2023-07-06',
    squads: [
      {
        id: '64523524b8da2446b3d4bb6b',
        name: 'U15',
      },
    ],
    emergency_contact: {
      firstname: 'John',
      lastname: 'Doe',
      relation: 'parent',
      phone: { country_code: '+1', number: '123 456 7890' },
      email: 'john.doh@gmail.com',
    },

    insurance: {
      insurance_carrier: 'Axa',
      group_number: 123456,
      policy_number: 123457,
      insurance_id: 123458,
    },
    created: '2020-01-20T00:00:00Z',
  },
  {
    id: '6452352401d171f70fdbc431',
    address: {
      id: '645235240d571499b1112bc3',
      city: 'Cawood',
      country: {
        abbreviation: 'SB',
        name: 'Cyprus',
        id: '645235242f82aac0f304992d',
      },
      line_1: 622,
      line_2: 'Schroeders Avenue',
      line_3: 'Branton Street',
      state: 'Virginia',
      zipcode: 5793,
    },
    avatar_url: buildLogoPath('kitman-staff.png'),
    user_title: null,
    date_of_birth: '2023-07-06',
    firstname: 'Chase',
    lastname: 'Mueller',
    organisations: [
      {
        id: 115,
        logo_full_path: buildLogoPath('kitman_logo_full_bleed.png'),
        name: 'LA Galaxy',
      },
    ],
    payment_status: true,
    registration_status: {
      id: null,
      status: 'pending_organisation',
      registration_status_reason: null,
    },
    registration_system_status: {
      id: 9,
      name: 'Pending Organisation',
      type: 'pending_organisation',
    },
    permission_group: 'permission_group',
  },
  {
    id: '64523524fd7bd4f6e436ef56',
    address: {
      id: '645235240cb1e3e6b9072e21',
      city: 'Grahamtown',
      country: {
        abbreviation: 'HT',
        name: 'Palau',
        id: '6452352464d0eeb95e56c02c',
      },
      line_1: 159,
      line_2: 'Haring Street',
      line_3: 'Crawford Avenue',
      state: 'Colorado',
      zipcode: 4134,
    },
    avatar_url: buildLogoPath('kitman-staff.png'),
    user_title: null,
    date_of_birth: '2023-07-06',
    firstname: 'Garrison',
    lastname: 'Bolton',
    organisations: [
      {
        id: 115,
        logo_full_path: buildLogoPath('kitman_logo_full_bleed.png'),
        name: 'LA Galaxy',
      },
    ],
    payment_status: false,
    registration_status: {
      id: null,
      status: 'pending_organisation',
      registration_status_reason: null,
    },
    registration_system_status: null,
    permission_group: 'permission_group',
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
