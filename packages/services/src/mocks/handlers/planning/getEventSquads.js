import { rest } from 'msw';

const data = {
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
                  id: 2,
                  user_id: 2,
                  firstname: 'Harry',
                  lastname: 'Doe',
                  fullname: 'Harry Doe',
                  shortname: 'J. Doe',
                  availability: 'available',
                  avatar_url: 'avatar_url',
                },
                {
                  id: 1,
                  user_id: 1,
                  firstname: 'Yao',
                  lastname: 'Wilfried',
                  fullname: 'Yao Wilfried',
                  shortname: 'Y. Wilfried',
                  availability: 'available',
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
                  id: 3,
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
  selected_athletes: [1, 2, 3],
};

const handler = rest.get(
  '/planning_hub/events/:eventId/squads',
  (_, res, ctx) => {
    return res(ctx.json(data));
  }
);

export { handler, data };
