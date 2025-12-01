import { rest } from 'msw';

const diagnostic = {
  diagnostic_reason_id: 90210,
  issue: {
    id: 11221,
    type: 'Injury',
  },
};
const data = {
  diagnostic,
};

const handler = rest.post(
  `/athletes/${diagnostic.athleteId}/diagnostics/${diagnostic.diagnosticId}/reconcile`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
