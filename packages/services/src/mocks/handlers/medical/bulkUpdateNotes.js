import { rest } from 'msw';

const data = [
  {
    id: 1,
    attachments: [],
    allow_list: [
      {
        id: 2,
        fullname: 'John Doe',
      },
      {
        id: 3,
        fullname: 'Jane Doe',
      },
    ],
  },
];

const handler = rest.post('/medical/notes/update_bulk', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
