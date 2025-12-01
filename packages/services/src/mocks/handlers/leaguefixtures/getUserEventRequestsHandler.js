import { rest } from 'msw';

const data = [
  {
    id: 1,
    created_at: '2024-06-23T10:30:00Z',
    reviewed_at: '2024-06-28T12:30:00Z',
    user: {
      id: 171171,
      firstname: 'Ted',
      lastname: 'Burger',
      fullname: 'Ted Burger-admin-eu',
      organisations: [
        {
          id: 5,
          name: 'Manchester United',
          logo_full_path: 'testimage.jpg',
        },
      ],
    },
    event: {
      id: 2694210,
      start_date: '2024-05-23T10:30:00Z',
      squad: {
        id: 8,
        name: 'International Squad',
      },
    },
    status: 'pending',
    reason: null,
    attachment: {
      filename: 'testFilename.pdf',
      url: 'testurl.com',
      filetype: 'pdf',
    },
    editable: true,
  },
];

const handler = rest.get(
  '/planning_hub/user_event_requests',
  (req, res, ctx) => {
    return res(ctx.json(data));
  }
);

export { handler, data };
