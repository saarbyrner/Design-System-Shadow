import { rest } from 'msw';

const data = [
  {
    coding_system_side_id: 21,
    coding_system_side_name: 'No side',
    side_id: 1,
    side_name: 'Left',
  },
  {
    coding_system_side_id: 22,
    coding_system_side_name: 'No side',
    side_id: 2,
    side_name: 'Center',
  },
  {
    coding_system_side_id: 23,
    coding_system_side_name: 'No side',
    side_id: 3,
    side_name: 'Right',
  },
  {
    coding_system_side_id: 24,
    coding_system_side_name: 'No side',
    side_id: 4,
    side_name: 'Bilateral',
  },
  {
    coding_system_side_id: 25,
    coding_system_side_name: 'No side',
    side_id: 5,
    side_name: 'N/A',
  },
];

const handler = rest.get('/emr/coding_system_sides', (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data };
