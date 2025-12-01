import { rest } from 'msw';

const data = {
  athlete_id: [],
  user_id: '2022-01-13T00:00:00+00:00',
  referring_physician: 'Bob Test',
  start_time: '2022-01-13T00:00:00+00:00',
  end_time: '2022-01-13T00:00:00+00:00',
  timezone: 'UTC',
  title: 'super title',
  treatments_attributes: [],
  annotation_attributes: { content: 'so note', attachments_attributes: [] },
};

const handler = rest.post('/treatment_sessions', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
