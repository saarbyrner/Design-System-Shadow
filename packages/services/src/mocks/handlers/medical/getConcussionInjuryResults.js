import { rest } from 'msw';

const data = [
  {
    id: 4,
    occurrence_date: '2022-08-17T00:00:00+01:00',
    examination_date: '2022-08-17T00:00:00+01:00',
    issue_type: 'Injury',
    injury_status: {
      description: 'Causing unavailability (time-loss)',
      cause_unavailability: true,
      restore_availability: false,
    },
    resolved_date: null,
    full_pathology: 'Concussion  [Left]',
    created_by: 133800,
    created_at: '2022-08-17T19:46:07+01:00',
    closed: false,
    unavailability_duration: 0,
    athlete: {
      id: 2942,
      fullname: 'Conway Adam',
      avatar_url:
        'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png?auto=enhance\u0026crop=faces\u0026fit=crop\u0026h=100\u0026ixlib=rails-4.2.0\u0026w=100',
      position: 'Scrum Half',
    },
    latest_note: null,
    issue: {
      id: 91132,
      athlete_id: 2942,
      osics: {
        osics_code: 'HNCX',
        pathology: {
          id: 420,
          name: 'Concussion ',
        },
        classification: {
          id: 20,
          name: 'Concussion/ Brain Injury',
        },
        body_area: {
          id: 7,
          name: 'Head',
        },
        icd: 'NA07.0',
        bamic: null,
      },
      side_id: 1,
      injury_type_id: 3,
      bamic_grade_id: null,
      bamic_site_id: null,
      coding: null,
    },
  },
];

const handler = rest.get('/ui/concussion/injuries*', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
