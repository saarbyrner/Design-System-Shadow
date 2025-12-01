export const athlete1 = {
  id: 1,
  firstname: 'Athlete',
  lastname: 'One',
  fullname: 'Athlete One',
  shortname: 'A. One',
  user_id: 1,
  avatar_url: 'url_string',
};

const dataSquadAthletes = {
  squads: [
    {
      id: 8,
      name: 'International Squad',
      position_groups: [
        {
          id: 25,
          name: 'Forward',
          order: 1,
          positions: [
            {
              id: 72,
              name: 'Loose-head Prop',
              order: 1,
              athletes: [
                athlete1,
                {
                  id: 2,
                  firstname: 'Athlete',
                  lastname: 'Two',
                  fullname: 'Athlete Two',
                  shortname: 'A. Two',
                  user_id: 2,
                  avatar_url: 'url_string',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 9,
      name: 'Some Squad',
      position_groups: [
        {
          id: 26,
          name: 'Backward',
          order: 1,
          positions: [
            {
              id: 73,
              name: 'Tight-head Prop',
              order: 1,
              athletes: [
                {
                  id: 3,
                  firstname: 'Athlete',
                  lastname: 'Three',
                  fullname: 'Athlete Three',
                  shortname: 'A. Three',
                  user_id: 3,
                  avatar_url: 'url_string',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const altData = [
  {
    id: 1,
    name: 'Squad 1',
    order: 1,
    position_groups: [
      {
        id: 1,
        name: 'Position group 1',
        positions: [
          {
            id: 1,
            name: 'Position 1',
            athletes: [
              {
                avatar_url: '',
                firstname: 'Any',
                fullname: 'Any Tester',
                id: 2345,
                lastname: 'Tester',
                shortname: 'A. Tester',
                user_id: 111111,
              },
              {
                avatar_url: '',
                firstname: 'Another',
                fullname: 'Another Test',
                id: 23456,
                lastname: 'Test',
                shortname: 'A. Tester',
                user_id: 111112,
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: 'Position group 2',
        positions: [
          {
            id: 2,
            name: 'Position 2',
            athletes: [
              {
                avatar_url: '',
                firstname: 'Joe',
                fullname: 'Joe Bloggs',
                id: 1345,
                lastname: 'Bloggs',
                shortname: 'J. Bloggs',
                user_id: 1113,
              },
              {
                avatar_url: '',
                firstname: 'Jane',
                fullname: 'Jane Bloggs',
                id: 2156,
                lastname: 'Bloggs',
                shortname: 'J. Bloggs',
                user_id: 1134,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Squad 2',
    order: 2,
    position_groups: [
      {
        id: 1,
        name: 'Position group 1',
        positions: [
          {
            id: 1,
            name: 'Position 1',
            athletes: [
              {
                avatar_url: '',
                firstname: 'Stephen',
                fullname: 'Stephen Smith',
                id: 1,
                lastname: 'Smith',
                shortname: 'S. Smith',
                user_id: 1,
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: 'Position group 2',
        positions: [
          {
            id: 2,
            name: 'Position 2',
            athletes: [
              {
                avatar_url: '',
                firstname: 'Michelle',
                fullname: 'Michelle Smith',
                id: 2,
                lastname: 'Smith',
                shortname: 'M. Smith',
                user_id: 2,
              },
            ],
          },
        ],
      },
    ],
  },
];

export default dataSquadAthletes;
