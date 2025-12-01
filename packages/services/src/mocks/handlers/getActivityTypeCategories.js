import { rest } from 'msw';

const data = [
  {
    id: 1,
    name: 'Conditioning',
  },
  {
    id: 2,
    name: 'Football Based',
  },
  {
    id: 3,
    name: 'Injury Prevention',
  },
  {
    id: 4,
    name: 'Performance Education',
  },
  {
    id: 5,
    name: 'Recovery',
  },
];

const handler = rest.get(
  '/ui/planning_hub/event_activity_type_categories',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
