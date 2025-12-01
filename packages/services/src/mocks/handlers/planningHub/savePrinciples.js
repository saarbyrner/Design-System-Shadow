import { rest } from 'msw';

const data = {
  id: 1,
  name: 'mocked principle',
  phases: [
    {
      id: 1,
      name: 'Attack',
    },
  ],
  principle_categories: [
    {
      id: 1,
      name: 'Passing',
    },
  ],
  principle_types: [
    {
      id: 1,
      name: 'Tecnical',
    },
  ],
  squads: [{ id: 1, name: 'International Squad' }],
};
const handler = rest.post(
  '/ui/planning_hub/principles/bulk_save',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
