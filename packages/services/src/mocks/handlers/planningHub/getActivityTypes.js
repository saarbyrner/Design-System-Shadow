import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Warm up',
    squads: [
      {
        id: 1,
        name: 'Squad 1',
      },
    ],
  },
  {
    id: 2,
    name: 'Training',
    squads: [
      {
        id: 2,
        name: 'Squad 2',
      },
    ],
  },
];
const handler = rest.get(
  '/ui/planning_hub/event_activity_types',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
