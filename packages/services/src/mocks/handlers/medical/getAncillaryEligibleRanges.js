import { rest } from 'msw';

const data = {
  eligible_ranges: [
    {
      start: null,
      end: '2023-06-20T10:54:00.000+01:00',
    },
    {
      start: '2023-07-12T10:54:00.000+01:00',
      end: null,
    },
  ],
};

const handler = rest.get(
  '/medical/athletes/:athleteId/ancillary_dates/eligible_ranges',
  (req, res, ctx) => {
    return res(ctx.json(data));
  }
);

export { handler, data };
