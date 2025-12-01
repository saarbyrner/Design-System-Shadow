import { rest } from 'msw';

/* TODO:
    These should be provided via an API call as they will differ on an org basis
    this is an NFL requirement so hardcoding here for now
    Also, we do not have infrasctructrue in place to save this value, as of yet. 
  */

const data = [
  { name: 'Sudden onset', id: 0, require_additional_input: false },
  { name: 'Gradual onset', id: 1, require_additional_input: false },
  { name: 'Unknown', id: 2, require_additional_input: false },
  { name: 'Other', id: 3, require_additional_input: false },
];

const handler = rest.get('/ui/medical/presentation_types', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
