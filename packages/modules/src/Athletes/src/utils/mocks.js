/* eslint-disable */

export const athletesMocked = [
  {
    id: 1,
    availability: 'available',
    avatar_url:
      'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
    fullname: 'John Doe',
  },
  {
    id: 2,
    availability: 'injured',
    avatar_url:
      'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
    fullname: 'Peter Grant',
  },
  {
    id: 3,
    availability: 'injured',
    avatar_url:
      'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
    fullname: 'Paul John',
  },
  {
    id: 4,
    availability: 'unavailable',
    avatar_url:
      'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
    fullname: 'John Nash',
  },
  {
    id: 5,
    availability: 'returning',
    avatar_url:
      'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
    fullname: 'Norman Peterson',
  },
];

export const mockedPositionGroups = [
  {
    id: 1,
    name: 'Goalkeeper',
    positions: [
      {
        id: 23,
        name: 'Fake position',
        athletes: [
          {
            id: 122,
            fullname: 'John Doe',
            avatar_url:
              'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
            position_group: ['Goalkeeper'],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Defenders',
    positions: [
      {
        id: 24,
        name: 'Fake position 2',
        athletes: [
          {
            id: 142,
            fullname: 'Peter Grant',
            avatar_url:
              'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
            position_group: ['Defenders'],
          },
        ],
      },
      {
        id: 24,
        name: 'Fake position 2',
        athletes: [
          {
            id: 143,
            fullname: 'Paul Smith',
            avatar_url:
              'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
            position_group: ['Defenders'],
          },
        ],
      },
      {
        id: 24,
        name: 'Fake position 2',
        athletes: [
          {
            id: 144,
            fullname: 'Robert Nash',
            avatar_url:
              'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
            position_group: ['Defenders'],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Midfielders',
    positions: [
      {
        id: 25,
        name: 'Fake position 3',
        athletes: [
          {
            id: 172,
            fullname: 'Norman Peterson',
            avatar_url:
              'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
            position_group: ['Midfielders'],
          },
        ],
      },
      {
        id: 25,
        name: 'Fake position 3',
        athletes: [
          {
            id: 173,
            fullname: 'Robert Kent',
            avatar_url:
              'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
            position_group: ['Midfielders'],
          },
        ],
      },
      {
        id: 25,
        name: 'Fake position 3',
        athletes: [
          {
            id: 174,
            fullname: 'Peter Maccao',
            avatar_url:
              'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
            position_group: ['Midfielders'],
          },
        ],
      },
    ],
  },
];
