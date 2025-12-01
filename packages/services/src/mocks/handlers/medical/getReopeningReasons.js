import { rest } from 'msw';

/* TODO:
    These should be provided via an API call as they will differ on an org basis
    this is an NFL requirement so hardcoding here for now
    Also, we do not have infrasctructrue in place to save this status, as of yet. 
  */

const data = [
  { name: 'Correct a note error', id: 0 },
  { name: 'Edit injury status', id: 1 },
  { name: 'Add an order', id: 2 },
  { name: 'Add a medication', id: 3 },
  { name: 'Other', id: 4 },
];

const handler = rest.get(
  '/ui/medical/issue_reopening_reasons',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
