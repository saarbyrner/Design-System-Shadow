import { rest } from 'msw';

const data = {
  athletes: [
    {
      fullname: 'Kev Doocey',
      id: 666,
      date_of_birth: 'Feb. 31, 1900',
    },
    {
      fullname: 'Kev Brady',
      id: 999,
      date_of_birth: 'Sept. 32, 1850',
    },
  ],
};

const handler = rest.post('/medical/rosters/search', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
