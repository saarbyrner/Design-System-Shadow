import { rest } from 'msw';

const data = {
  country_codes: [
    ['Afghanistan +93', 'AF'],
    ['Åland Islands +358', 'AX'],
    ['Albania +355', 'AL'],
    ['Algeria +213', 'DZ'],
    ['American Samoa +1', 'AS'],
  ],
};

const handler = rest.get('/ui/country_codes', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
