import { rest } from 'msw';

const data = [
  {
    id: 13,
    name: 'Other',
    created_at: '2023-07-06T14:10:50Z',
    updated_at: '2023-07-06T14:10:50Z',
    archived: false,
  },
  {
    id: 21,
    name: 'Second category',
    created_at: '2023-07-06T15:46:02Z',
    updated_at: '2023-07-06T15:46:02Z',
    archived: false,
  },
];
const handler = rest.get(
  '/ui/planning_hub/event_attachment_categories',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
