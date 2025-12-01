export const data = {
  id: 162221,
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
  avatar_url:
    'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=157&ixlib=rails-4.2.0&w=157',
  firstname: 'KLGalaxy',
  lastname: 'Athlete',
  email: 'edaly+klgalaxyathlete@kitmanlabs.com',
  created: '2023-06-29T09:26:08Z',
  organisations: [
    {
      id: 1267,
      name: 'KL Galaxy',
      logo_full_path:
        'https://kitman-staging.imgix.net/kitman-stock-assets/test.png?ixlib=rails-4.2.0&fit=fill&trim=off&bg=00FFFFFF',
    },
  ],
  payment_status: true,
  permission_group: 'Athlete',
  registration_status: {
    id: null,
    status: 'incomplete',
    created_at: null,
  },
  registration_system_status: {
    id: 1,
    name: 'Incomplete',
    type: 'incomplete',
  },
  date_of_birth: '1989-06-02',
  mobile_number: null,
  ussf_license_id: null,
  insurance: {
    insurance_carrier: null,
    group_number: null,
    policy_number: null,
    insurance_id: null,
  },
  gender: null,
  middlename: null,
  affix: null,
  birthplace: null,
  squads: [],
  emergency_contact: {
    firstname: null,
    lastname: null,
    relation: null,
    email: null,
    phone: {
      country_code: null,
      number: null,
    },
  },
  registrations: [
    {
      id: 1,
      user_id: 11111,
      status: 'incomplete',
      division: {
        id: 1,
        name: 'KLS Next',
      },
      registration_system_status: {
        id: 1,
        name: 'Incomplete',
        type: 'incomplete',
      },
      registration_requirement: {
        id: 1,
        active: true,
      },
    },
  ],
};

export const response = {
  data,
};
