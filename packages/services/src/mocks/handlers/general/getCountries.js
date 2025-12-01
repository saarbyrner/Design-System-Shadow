import { rest } from 'msw';
import { countriesData } from './data.mock';

const handler = rest.get('/ui/countries', (req, res, ctx) => {
  return res(ctx.json(countriesData));
});

export { handler, countriesData };
