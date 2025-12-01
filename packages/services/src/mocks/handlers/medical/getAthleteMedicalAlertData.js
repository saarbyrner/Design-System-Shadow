import { rest } from 'msw';

const data = [
  {
    alert_title: 'Asthma',
    athlete: {
      availability: 'unavailable',
      firstname: 'Test',
      fullname: 'Testing',
      id: 40211,
      lasname: '123',
      position: 'defender',
      shorname: 'test123',
    },
    athlete_id: 40211,
    diagnosed_on: null,
    id: 13,
    medical_alert: {
      id: 7,
      name: 'Cancer',
    },
    restricted_to_doc: false,
    restricted_to_psych: false,
    severity: 'mild',
  },
];

const handler = rest.post(
  '/ui/medical/athlete_medical_alerts/search',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
