import { rest } from 'msw';

const data = {
  id: 1,
  athlete_id: 1,
  links: {
    self: '/athletes/1/illnesses/1'
  }
};

const handler = rest.get('/athletes/:athleteId/illnesses/:illnessId', (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data };
