// @flow
export const mockUserResult = {
  data: {
    id: 1,
    firstname: 'Freddy',
    lastname: 'Adu',
    fullname: 'Freddy Adu',
    email: 'mail@mail.com',
    username: 'fadu',
    date_of_birth: null,
    athlete: {
      id: 96417,
      fullname: 'Freddy Adu',
      position: 'Centre Back',
      date_of_birth: '2 June 1989',
      organisations: [
        {
          id: 1267,
          name: 'KL Galaxy',
          logo_full_path: 'big/dirty/url',
        },
      ],
      avatar_url: 'Logo/url',
    },
  },
};

export const mockUserWithOrgsResult = {
  data: {
    ...mockUserResult.data,
    athlete: {
      ...mockUserResult.data.athlete,
      organisations: [
        {
          id: 1267,
          name: 'KL Galaxy',
          logo_full_path: 'big/dirty/url',
        },
        {
          id: 1268,
          name: 'Kinter Miami',
          logo_full_path: 'big/dirty/url',
        },
        {
          id: 1269,
          name: 'KL Quakes',
          logo_full_path: 'big/dirty/url',
        },
        {
          id: 1270,
          name: 'KL Revolution',
          logo_full_path: 'big/dirty/url',
        },
      ],
      avatar_url: 'Logo/url',
    },
  },
};

export const sixthFebruary2024 = '2024-02-06T12:55:09+00:00';

export const movementAssertions = [
  'Jul 1, 1988 trade Rockmount AFC Rockmount AFC',
  'Jul 1, 1989 trade Cobh Ramblers Cobh Ramblers',
  'Jul 1, 1989 trade Nottingham Forest Nottingham Forest',
  'Jul 1, 1993 trade Manchester United Manchester United',
  'Jan 1, 2006 trade Celtic FC Celtic FC',
  'Jul 1, 2006 retire Celtic FC Celtic FC',
];

export const medicalTrialAssertions = [
  'Jul 1, 1988 Rockmount AFC Rockmount AFC',
  'Jul 1, 1989 Cobh Ramblers Cobh Ramblers',
  'Jul 1, 1989 Nottingham Forest Nottingham Forest',
  'Jul 1, 1993 Manchester United Manchester United',
  'Jan 1, 2006 Celtic FC Celtic FC',
];
