import { rest } from 'msw';

const data = {
  alert_title: 'Asthma',
  athlete: {
    availability: 'unavailable',
    firstname: 'Test',
    fullname: 'McTesterson',
    id: 44,
    lasname: '123',
    position: 'defender',
    shorname: 'test123',
  },
  athlete_id: 44,
  diagnosed_on: null,
  id: 13,
  medical_alert: {
    id: 7,
    name: 'Stuffy Nose',
  },
  restricted_to_doc: false,
  restricted_to_psych: false,
  severity: 'mild',
};

const handler = rest.put(
  '/medical/athlete_medical_alerts/:alertId/update',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
