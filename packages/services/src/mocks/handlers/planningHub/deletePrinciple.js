import { rest } from 'msw';

const data = {
  id: 1,
  name: 'Long pass',
  principle_categories: [],
  principle_types: [
    {
      id: 1,
      name: 'Tecnical',
    },
  ],
  phases: [],
  squads: [],
};

const handler = rest.delete(
  '/ui/planning_hub/principles/:principleId',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
