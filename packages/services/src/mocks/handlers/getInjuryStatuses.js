import { rest } from 'msw';

const data = [
  {
    id: 1,
    injury_status_system_id: 1,
    description: 'Causing unavailability (time-loss)',
    order: 1,
    color: 'ff0000',
    cause_unavailability: true,
    restore_availability: false,
    is_resolver: false,
  },
  {
    id: 2,
    injury_status_system_id: 1,
    description: 'Not affecting availability (medical attention)',
    order: 2,
    color: 'ffaa00',
    cause_unavailability: false,
    restore_availability: true,
    is_resolver: false,
  },
  {
    id: 3,
    injury_status_system_id: 1,
    description: 'Affecting availability (medical attention)',
    order: 3,
    color: 'ffaa00',
    cause_unavailability: false,
    restore_availability: true,
    is_resolver: false,
  },
  {
    id: 4,
    injury_status_system_id: 1,
    description: 'Resolved',
    order: 4,
    color: 'ffaa00',
    cause_unavailability: false,
    restore_availability: true,
    is_resolver: true,
  },
];

const handler = rest.get('/injury_statuses', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
