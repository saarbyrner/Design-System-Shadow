// @flow
import { rest } from 'msw';

import data from '../data/athlete_reviews';

const handler = rest.patch(
  '/athletes/:athleteId/athlete_reviews/:reviewId/update_development_goal',
  (req, res, ctx) =>
    res(
      ctx.json({
        ...data[0].development_goals[0],
        comments: data[0].development_goals[0].comments.slice().concat([
          {
            created_at: '2024-05-23T19:16:27+01:00',
            development_goal_id: 6141,
            id: 30,
            text: 'Co',
            user: {
              avatar_url: 'JohnCena.jpg',
              fullname: 'John Cena',
              id: 234,
            },
          },
        ]),
      })
    )
);

export { handler, data };
