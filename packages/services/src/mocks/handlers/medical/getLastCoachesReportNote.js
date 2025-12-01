import { rest } from 'msw';

const data = {
  title: 'Note Title',
  content: 'Note content',
  date: '2017-07-20T00:00:00.000+01:00',
  restricted_annotation: false,
};

const handler = rest.get('/medical/notes/last_annotation', (req, res, ctx) =>
  res(ctx.json(data))
);

export { data, handler };
