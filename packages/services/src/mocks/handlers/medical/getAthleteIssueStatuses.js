import { rest } from 'msw';

const data = [
  {
    id: 1,
    injury_status_system_id: 1,
    description: 'Causing unavailability',
    order: 1,
    color: 'red',
    cause_unavailability: true,
    restore_availability: false,
  },
  {
    id: 2,
    injury_status_system_id: 2,
    description: 'Not affecting availability',
    order: 2,
    color: 'orange',
    cause_unavailability: true,
    restore_availability: false,
  },
  {
    id: 3,
    injury_status_system_id: 3,
    description: 'Resolved',
    order: 3,
    color: 'grey',
    cause_unavailability: true,
    restore_availability: false,
  },
];
const handler = rest.get(
  '/ui/medical/issues/injury_statuses',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
