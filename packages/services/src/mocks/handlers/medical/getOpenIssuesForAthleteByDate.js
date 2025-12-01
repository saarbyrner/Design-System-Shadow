import { rest } from 'msw';

const data = {
  issues: [
    { id: 1, name: 'Broken Ankle', availability: 'unavailable' },
    { id: 2, name: 'Anemia', availability: 'available' },
  ],
};

const handler = rest.get(
  '/athletes/:id/issues/open_issues_on_date',
  (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(data));
  }
);

export { handler, data };
