import { rest } from 'msw';
import data from '../data/fetchAdministrationAthletes.mock';

const handler = rest.get('/administration/athletes', (req, res, ctx) => {
  const query = req.url.searchParams;
  const activeQueryParam = query.get('active');

  if (activeQueryParam === false) {
    return res(ctx.json(data.inactiveAthletes));
  }

  return res(ctx.json(data.activeAthletes));
});

export { handler, data };
