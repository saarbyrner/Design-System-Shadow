import { rest } from 'msw';

const data = {
  current_squad: {
    id: 8,
    name: 'International Squad',
    duration: 80,
    is_default: null,
    created_by: null,
    created: '2013-10-17T16:10:14.000+01:00',
    updated: null,
    sport_id: null,
  },
};
const handler = rest.get('/ui/initial_data_assessments', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
