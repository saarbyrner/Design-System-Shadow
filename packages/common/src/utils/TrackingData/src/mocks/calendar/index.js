// @flow
const mockEventData = {
  duplicated_event_id: 1,
  attachments: [],
  attached_links: [
    {
      id: 5,
      event_attachment_categories: [
        {
          id: 23,
          name: 'Player Profile',
        },
      ],
      created_at: '2023-08-22T18:00:07+01:00',
      updated_at: '2023-08-22T18:00:07+01:00',
      attached_link: {},
    },
  ],
  staff_id: ['23', '123'],
  event_location: { name: 'Manchester' },
  workload_type: 1,
  athlete_ids: [23, 7],
  event_users: [1, 2],
  start_date: '2023-08-22T18:00:07+01:00',
};

export { mockEventData };
