// eslint-disable-next-line camelcase
const avatar_url =
  'https://kitman-staging.imgix.net/avatar.jpg?auto=enhance&crop=faces&fit=crop&h=100&ixlib=rails-4.2.0&w=100';

// 'Marco Halvorson' with id 781 is in both squads, this is to test that we don't show duplicates
const data = {
  squads: [
    {
      id: 1,
      ownerId: 1,
      name: 'Squad 1',
      athletes: [
        {
          id: 372,
          fullname: 'Tommie Weber',
          avatar_url,
        },
        {
          id: 436,
          fullname: 'Merle Rolfson',
          avatar_url,
        },
        {
          id: 781,
          fullname: 'Marco Halvorson',
          avatar_url,
        },
      ],
    },
    {
      id: 2,
      ownerId: 2,
      name: 'Squad 2',
      athletes: [
        {
          id: 781,
          fullname: 'Marco Halvorson',
          avatar_url,
        },
        {
          id: 784,
          fullname: 'Kobe McClure',
          avatar_url,
        },
        {
          id: 858,
          fullname: 'Gwen Mante',
          avatar_url,
        },
      ],
    },
  ],
};

export default data;
