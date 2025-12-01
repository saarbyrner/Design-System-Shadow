import { rest } from 'msw';

const data = [
  {
    id: 1,
    association_id: 3,
    scout_name: 'john',
    scout_surname: 'doe',
    email: 'john.doe@example.com',
  },
  {
    id: 2,
    association_id: 3,
    scout_name: 'sanja',
    scout_surname: 'soltic',
    email: 'sanja.soltic@email.com',
  },
];

const handler = rest.get(
  `/planning_hub/association_external_scouts`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
