import { rest } from 'msw';

const data = {
  id: 1,
  athlete_id: 1,
  athlete: {
    id: 1,
    avatar_url: 'url-link',
    firstname: 'John Doe',
    lastname: 'Doe',
    fullname: 'John Doe',
    availability: 'unavailable',
    position: 'First Row',
  },
  display_name: 'Asthma',
  medical_alert: {
    id: 2,
    name: 'Asthma',
  },
  alert_title: 'Asthma Title',
  severity: 'severe',
  restricted_to_doc: false,
  restricted_to_psych: false,
  diagnosed_on: null,
  archived: false,
  updated_at: '2023-05-01',
  created_at: '2023-01-01',
  created_by: {
    fullname: 'John Doe',
  },
};

const handler = rest.get(
  `/ui/medical/athlete_medical_alerts/:alertId`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
