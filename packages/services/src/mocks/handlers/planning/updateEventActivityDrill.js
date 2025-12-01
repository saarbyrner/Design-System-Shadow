import { rest } from 'msw';

const data = {
  attachments: [],
  attachments_attributes: [],
  created_by: { id: 10, fullname: 'Rory Harford' },
  diagram: null,
  duration: null,
  event_activity_drill_label_ids: [],
  event_activity_drill_labels: [],
  event_activity_type: null,
  id: 1,
  intensity: null,
  library: true,
  links: [],
  name: 'Updating Drill item',
  notes: '<p><br></p>',
  pitch_length: null,
  pitch_width: null,
  principles: [],
  reps: null,
  rest_duration: null,
  sets: null,
};

const handler = rest.patch(
  `/planning_hub/event_activity_drills/:drillId`,
  (req, res, ctx) => {
    const drillId = JSON.parse(JSON.stringify(req.params)).drillId;

    // drillId 14 is used to delete item from library
    if (drillId === '14') {
      const deleteData = {
        attachments: [],
        diagram: null,
        duration: null,
        event_activity_drill_labels: [],
        event_activity_type: {},
        id: 14,
        intensity: 'low',
        library: false,
        links: [],
        name: 'Name 1',
        notes: '<p><br></p>',
        pitch_length: null,
        pitch_width: null,
        principles: [],
        reps: null,
        rest_duration: null,
        sets: null,
      };
      return res(ctx.json(deleteData));
    }

    return res(ctx.json(data));
  }
);

export { handler, data };
