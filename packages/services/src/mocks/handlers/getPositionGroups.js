// @flow
import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Position group 1',
    positions: [
      {
        id: 1,
        name: 'Position 1',
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
      },
    ],
  },
];

const handler = rest.get('/ui/position_groups', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
