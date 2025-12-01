import { rest } from 'msw';

const data = {
  event_activity_drills: [
    {
      id: 11,
      event_activity_type: {
        id: 1,
        name: 'Warm up',
      },
      name: 'Paris Marathon',
      duration: null,
      sets: null,
      reps: null,
      rest_duration: null,
      pitch_width: null,
      pitch_length: null,
      intensity: 'low',
      principles: [{ id: 1, name: 'Principle 1' }],
      notes: '<p>Paris Marathon description<br></p>',
      diagram: null,
      attachments: [],
      links: [],
      event_activity_drill_labels: [],
      library: true,
      created_by: {
        id: 133800,
        fullname: 'Rory Harford',
      },
    },
    {
      id: 12,
      event_activity_type: {
        id: 2,
        name: 'Training',
      },
      name: 'Berlin Marathon',
      duration: null,
      sets: null,
      reps: null,
      rest_duration: null,
      pitch_width: null,
      pitch_length: null,
      intensity: 'medium',
      principles: [{ id: 2, name: 'Principle 2' }],
      notes: '<p>Berlin Marathon description<br></p>',
      diagram: null,
      attachments: [],
      links: [],
      event_activity_drill_labels: [],
      library: true,
      created_by: {
        id: 133800,
        fullname: 'Rory Harford',
      },
    },
    {
      id: 13,
      event_activity_type: {
        id: 1,
        name: 'Warm up',
      },
      name: 'NY Marathon',
      duration: null,
      sets: null,
      reps: null,
      rest_duration: null,
      pitch_width: null,
      pitch_length: null,
      intensity: 'high',
      principles: [{ id: 3, name: 'Principle 3' }],
      notes: '<p>NY Marathon description<br></p>',
      diagram: null,
      attachments: [],
      links: [],
      event_activity_drill_labels: [],
      library: true,
      created_by: {
        id: 133800,
        fullname: 'Rory Harford',
      },
    },
    {
      id: 14,
      event_activity_type: {
        id: 2,
        name: 'Training',
      },
      name: 'Tokyo Marathon',
      duration: null,
      sets: null,
      reps: null,
      rest_duration: null,
      pitch_width: null,
      pitch_length: null,
      intensity: null,
      principles: [],
      notes: '<p>Tokyo Marathon description<br></p>',
      diagram: null,
      attachments: [],
      links: [],
      event_activity_drill_labels: [],
      library: true,
      created_by: {
        id: 133800,
        fullname: 'Rory Harford',
      },
    },
    {
      id: 15,
      event_activity_type: {
        id: 1,
        name: 'Warm up',
      },
      name: 'Siberia Marathon',
      duration: null,
      sets: null,
      reps: null,
      rest_duration: null,
      pitch_width: null,
      pitch_length: null,
      intensity: 'medium',
      principles: [],
      notes: '<p>Siberia Marathon description<br></p>',
      diagram: null,
      attachments: [],
      links: [],
      event_activity_drill_labels: [],
      library: true,
      created_by: {
        id: 133800,
        fullname: 'Rory Harford',
      },
    },
    {
      id: 16,
      event_activity_type: null,
      name: 'Non-typed Marathon 1',
      duration: null,
      sets: null,
      reps: null,
      rest_duration: null,
      pitch_width: null,
      pitch_length: null,
      intensity: null,
      principles: [],
      notes: '<p>Non-typed Marathon 1 description<br></p>',
      diagram: null,
      attachments: [],
      links: [],
      event_activity_drill_labels: [],
      library: true,
      created_by: {
        id: 133800,
        fullname: 'Rory Harford',
      },
    },
    {
      id: 17,
      event_activity_type: null,
      name: 'Non-typed Marathon 2',
      duration: null,
      sets: null,
      reps: null,
      rest_duration: null,
      pitch_width: null,
      pitch_length: null,
      intensity: 'low',
      principles: [],
      notes: '<p>Non-typed Marathon 2 description<br></p>',
      diagram: null,
      attachments: [],
      links: [],
      event_activity_drill_labels: [],
      library: true,
      created_by: {
        id: 1236,
        fullname: "Stuart O'Brien",
      },
    },
    {
      id: 18,
      event_activity_type: {
        id: 1,
        name: 'Warm up',
      },
      name: 'Favorited Marathon 1',
      duration: null,
      sets: null,
      reps: null,
      rest_duration: null,
      pitch_width: null,
      pitch_length: null,
      intensity: 'low',
      principles: [],
      notes: '<p>Non-typed Marathon 2 description<br></p>',
      diagram: null,
      attachments: [],
      links: [],
      event_activity_drill_labels: [],
      library: true,
      created_by: {
        id: 1236,
        fullname: "Stuart O'Brien",
      },
    },
    {
      id: 19,
      event_activity_type: {
        id: 2,
        name: 'Training',
      },
      name: 'Favorited Marathon 2',
      duration: null,
      sets: null,
      reps: null,
      rest_duration: null,
      pitch_width: null,
      pitch_length: null,
      intensity: 'low',
      principles: [],
      notes: '<p>Non-typed Marathon 2 description<br></p>',
      diagram: null,
      attachments: [],
      links: [],
      event_activity_drill_labels: [],
      library: true,
      created_by: {
        id: 1236,
        fullname: "Stuart O'Brien",
      },
    },
  ],
  next_id: null,
};

const handler = rest.post(
  '/planning_hub/event_activity_drills/search',
  async (req, res, ctx) => {
    const requestData = await req.json();
    const drills = data.event_activity_drills;

    const searchQuery = requestData.search_expression;
    if (searchQuery) {
      return res(
        ctx.json({
          event_activity_drills: drills.filter(({ name }) =>
            name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        })
      );
    }

    const typeIds = requestData.event_activity_type_ids;
    if (typeIds?.length > 0) {
      return res(
        ctx.json({
          event_activity_drills: drills.filter(
            ({ event_activity_type: type }) =>
              typeIds.some((id) => type?.id === id)
          ),
        })
      );
    }

    const userIds = requestData.user_ids;
    if (userIds?.length > 0) {
      return res(
        ctx.json({
          event_activity_drills: drills.filter(({ created_by: author }) =>
            userIds.some((id) => author?.id === id)
          ),
        })
      );
    }

    const principleIds = requestData.principle_ids;
    if (principleIds?.length > 0) {
      const result = drills.filter(({ principles }) =>
        principleIds.some((id) =>
          principles.some(({ id: principleId }) => id === principleId)
        )
      );
      return res(
        ctx.json({
          event_activity_drills: result,
        })
      );
    }

    return res(ctx.json(data));
  }
);

export { handler, data };
