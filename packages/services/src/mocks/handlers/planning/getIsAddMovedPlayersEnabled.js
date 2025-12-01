import { rest } from 'msw';

const data = {
  value: true,
};

const handler = rest.get(
  '/organisation_preferences/moved_players_in_organisation_at_event',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
