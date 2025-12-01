import { rest } from 'msw';

const data = [
  {
    id: 1,
    x: 1,
    y: 3,
    order: 1,
    position_id: 1,
    field_id: 1,
    formation_id: 2,
    position: {
      id: 1,
      abbreviation: 'GK',
    },
  },
  {
    id: 2,
    x: 2,
    y: 4,
    order: 2,
    position_id: 1,
    field_id: 1,
    formation_id: 2,
    position: {
      position: 2,
      abbreviation: 'CB',
    },
  },
];

const handler = rest.get(
  '/ui/planning_hub/formation_position_views',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
