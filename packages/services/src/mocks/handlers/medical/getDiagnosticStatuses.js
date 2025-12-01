import { rest } from 'msw';

const data = [
  { value: 'incomplete', text: 'incomplete' },
  { value: 'pending', text: 'Pending' },
  { value: 'missing reason', text: 'Missing Reason' },
  { value: 'ordered', text: 'Ordered' },
  { value: 'key result', text: 'Key Result' },
  { value: 'normal/abnormal', text: 'Normal/Abnormal' },
  { value: 'complete', text: 'Complete' },
];
const handler = rest.get('ui/medical/diagnostics/statuses', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
