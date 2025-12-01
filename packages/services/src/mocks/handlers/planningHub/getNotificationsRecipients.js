import { rest } from 'msw';

const data = [
  {
    id: 1,
    association_id: 85,
    name: 'Jane Doe',
    email: 'jane_doe@email.com',
  },
  {
    id: 2,
    association_id: 85,
    name: 'John Doe',
    email: 'john_doe@email.com',
  },
];

const handler = rest.get(
  '/planning_hub/association_contacts',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
