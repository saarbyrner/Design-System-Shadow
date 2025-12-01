import { rest } from 'msw';

const data = {
  events: [
    {
      event: {
        type: 'Random Data Generator',
        datetime: '2025-09-29T12:00:00.000+01:00',
        duration: 90,
        unique_identifier: '2025-09-29',
        integration_date: '2025-09-29',
      },
      athletes: [
        {
          id: 27280,
          firstname: 'Gustavo',
          lastname: 'Lazaro Amendola',
          fullname: 'Gustavo Lazaro Amendola',
        },
        {
          id: 10960,
          firstname: 'Jonathan',
          lastname: 'Murphy',
          fullname: 'Jonathan Murphy',
        },
        {
          id: 31602,
          firstname: 'Mark - Athlete',
          lastname: 'McCaffrey',
          fullname: 'Mark - Athlete McCaffrey',
        },
      ],
      non_setup_athletes_identifiers: [
        'athlete_external_id-2',
        'athlete_external_id-3',
        'athlete_external_id-5',
        'athlete_external_id-6',
        'athlete_external_id-8',
        'athlete_external_id-9',
        'athlete_external_id-10',
      ],
    },
    {
      event: {
        type: 'Random Data Generator',
        datetime: '2025-09-30T12:00:00.000+01:00',
        duration: 90,
        unique_identifier: '2025-09-30',
        integration_date: '2025-09-30',
      },
      athletes: [
        {
          id: 27280,
          firstname: 'Gustavo',
          lastname: 'Lazaro Amendola',
          fullname: 'Gustavo Lazaro Amendola',
        },
        {
          id: 10960,
          firstname: 'Jonathan',
          lastname: 'Murphy',
          fullname: 'Jonathan Murphy',
        },
        {
          id: 31602,
          firstname: 'Mark - Athlete',
          lastname: 'McCaffrey',
          fullname: 'Mark - Athlete McCaffrey',
        },
      ],
      non_setup_athletes_identifiers: [
        'athlete_external_id-2',
        'athlete_external_id-3',
        'athlete_external_id-5',
        'athlete_external_id-6',
        'athlete_external_id-8',
        'athlete_external_id-9',
        'athlete_external_id-10',
      ],
    },
    {
      event: {
        type: 'Random Data Generator',
        datetime: '2025-10-01T12:00:00.000+01:00',
        duration: 90,
        unique_identifier: '2025-10-01',
        integration_date: '2025-10-01',
      },
      athletes: [
        {
          id: 27280,
          firstname: 'Gustavo',
          lastname: 'Lazaro Amendola',
          fullname: 'Gustavo Lazaro Amendola',
        },
        {
          id: 10960,
          firstname: 'Jonathan',
          lastname: 'Murphy',
          fullname: 'Jonathan Murphy',
        },
        {
          id: 31602,
          firstname: 'Mark - Athlete',
          lastname: 'McCaffrey',
          fullname: 'Mark - Athlete McCaffrey',
        },
      ],
      non_setup_athletes_identifiers: [
        'athlete_external_id-2',
        'athlete_external_id-3',
        'athlete_external_id-5',
        'athlete_external_id-6',
        'athlete_external_id-8',
        'athlete_external_id-9',
        'athlete_external_id-10',
      ],
    },
  ],
  success: true,
};

const handler = rest.post(
  `/workloads/integrations/:id/fetch_data`,
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
