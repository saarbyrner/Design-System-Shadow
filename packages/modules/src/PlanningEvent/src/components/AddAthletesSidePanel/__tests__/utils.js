// @flow
export const mockedEventSquads = {
  squads: [
    {
      id: 1,
      name: 'Squad 1',
      position_groups: [
        {
          id: 1,
          name: 'Forwards',
          order: 0,
          positions: [
            {
              id: 1,
              name: 'Forward',
              abbreviation: 'FW',
              order: 0,
              athletes: [
                {
                  id: 1111,
                  user_id: 2,
                  firstname: 'Harry',
                  lastname: 'Doe',
                  fullname: 'Harry Doe',
                  shortname: 'J. Doe',
                  availability: 'unavailable',
                  avatar_url: 'avatar_url',
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'Midfielders',
          order: 1,
          positions: [
            {
              id: 3,
              name: 'Midfielder',
              abbreviation: 'HB',
              order: 0,
              athletes: [
                {
                  id: 2222,
                  user_id: 3,
                  firstname: 'Michael',
                  lastname: 'Yao',
                  fullname: 'Michael Yao',
                  shortname: 'M. Yao',
                  availability: 'injured',
                  avatar_url: 'avatar_url',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  selected_athletes: [1111, 2222],
};

export const additionalMockSquad = {
  id: 2,
  name: 'Squad 2',
  position_groups: [
    {
      id: 1,
      name: 'Forwards',
      order: 0,
      positions: [
        {
          id: 1,
          name: 'Forward',
          abbreviation: 'FW',
          order: 0,
          athletes: [
            {
              id: 12222,
              user_id: 2,
              firstname: 'Harry',
              lastname: 'Doe 2',
              fullname: 'Harry Doe 2',
              shortname: 'J. Doe 2',
              availability: 'unavailable',
              avatar_url: 'avatar_url',
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: 'Midfielders',
      order: 1,
      positions: [
        {
          id: 3,
          name: 'Midfielder',
          abbreviation: 'HB',
          order: 0,
          athletes: [
            {
              id: 2111,
              user_id: 3,
              firstname: 'Michael',
              lastname: 'Yao 2',
              fullname: 'Michael Yao 2',
              shortname: 'M. Yao 2',
              availability: 'injured',
              avatar_url: 'avatar_url',
            },
          ],
        },
      ],
    },
  ],
};
