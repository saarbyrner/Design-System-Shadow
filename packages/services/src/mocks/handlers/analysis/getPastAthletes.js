import { rest } from 'msw';
import { PAST_ATHLETES_ENDPOINT_URL } from '@kitman/services/src/services/analysis/getPastAthletes';

const data = [
  {
    id: 188,
    fullname: 'Jamie Heasip',
  },
  {
    id: 189,
    fullname: 'Philip Nathan',
  },
];

const handler = rest.post(PAST_ATHLETES_ENDPOINT_URL, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
