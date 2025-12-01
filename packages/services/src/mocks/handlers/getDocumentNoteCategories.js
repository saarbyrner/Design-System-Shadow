import { rest } from 'msw';

const data = [
  {
    created_at: '2022-12-05T09:40:59Z',
    id: 1,
    name: 'Category Note 1',
    updated_at: '2022-12-05T09:40:59Z',
  },
  {
    created_at: '2022-12-05T09:40:59Z',
    id: 2,
    name: 'Category Note 2',
    updated_at: '2022-12-05T09:40:59Z',
  },
  {
    created_at: '2022-12-05T09:40:59Z',
    id: 3,
    name: 'Category Note 3',
    updated_at: '2022-12-05T09:40:59Z',
  },
];

const handler = rest.get('/ui/document_note_categories', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
