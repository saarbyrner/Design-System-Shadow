import { rest } from 'msw';

const data = [
  {
    name: 'Direct Contact: To injured body part OR immediately above / below injured body part',
    id: 0,
    require_additional_input: false,
    parent_id: null,
  },
  {
    name: 'Indirect Contact: To other part of body not injuredadual onset',
    id: 1,
    require_additional_input: false,
    parent_id: null,
  },
  {
    name: 'Non-Contact',
    id: 2,
    require_additional_input: false,
    parent_id: null,
  },
  {
    name: 'Insidious/Overuse',
    id: 3,
    require_additional_input: false,
    parent_id: null,
  },
  {
    name: 'Unknown/Inconclusive',
    id: 4,
    require_additional_input: true,
    parent_id: null,
  },
];

const handler = rest.get('/ui/medical/issue_contact_types', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
