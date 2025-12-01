import { rest } from 'msw';

const data = [
  { players: { compliant: true, message: null } },
  { captain: { compliant: true, message: null } },
  { lineup: { compliant: false, message: 'The lineup must be filled in' } },
];

const handler = rest.get(
  '/planning_hub/game_compliance/:event_id/rules',
  (req, res, ctx) => {
    return res(ctx.json(data));
  }
);

export { handler, data };
