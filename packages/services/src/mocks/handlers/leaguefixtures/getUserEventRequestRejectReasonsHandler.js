import { rest } from 'msw';

const data = [
  { id: 1, type_name: 'Not accepting visitors', require_additional_input: 0 },
  { id: 2, type_name: 'Conflict of interest', require_additional_input: 0 },
  { id: 3, type_name: 'Other', require_additional_input: 1 },
];

const handler = rest.get(
  '/planning_hub/user_event_requests/rejection_reasons',
  (req, res, ctx) => {
    return res(ctx.json(data));
  }
);

export { handler, data };
