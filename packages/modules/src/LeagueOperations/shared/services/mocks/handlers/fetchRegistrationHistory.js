import { rest } from 'msw';

const data = {
  id: 10,
  user_id: 234054,
  status: 'pending_organisation',
  status_history: [
    {
      id: 166,
      status: 'rejected_association',
      created_at: '2023-07-14T10:49:50Z',
      annotations: [
        {
          content: 'Sure look, why not?',
          annotation_date: '2023-07-13T20:00:00Z',
        },
      ],
    },
    {
      id: 165,
      status: 'pending_organisation',
      created_at: '2023-07-13T20:02:26Z',
      annotations: [],
    },
  ],
};

const handler = rest.get(
  `/registration/users/:user_id/registrations/:id/history`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
