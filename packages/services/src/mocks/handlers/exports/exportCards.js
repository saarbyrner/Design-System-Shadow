import { rest } from 'msw';

const data = {
  athleteCards: {
    id: 1,
    name: 'Athlete Cards Export',
    export_type: 'mls_athlete_cards_export',
    created_at: '2022-09-04T20:42:10+01:00',
    attachments: [
      {
        id: 1,
        filetype: 'text/csv',
        filesize: 250,
        filename: 'Athlete Cards Export',
        url: 'http://s3:9000/injpro-staging/fake_exports',
      },
    ],
    status: 'pending',
  },
  staffCards: {
    id: 1,
    name: 'Staff Cards Export',
    export_type: 'mls_staff_cards_export',
    created_at: '2022-09-04T20:42:10+01:00',
    attachments: [
      {
        id: 1,
        filetype: 'text/csv',
        filesize: 250,
        filename: 'Staff Cards Export',
        url: 'http://s3:9000/injpro-staging/fake_exports',
      },
    ],
    status: 'pending',
  },
  yellowCards: {
    id: 1,
    name: 'Yellow Cards Export',
    export_type: 'yellow_cards_export',
    created_at: '2022-09-04T20:42:10+01:00',
    attachments: [
      {
        id: 1,
        filetype: 'text/csv',
        filesize: 250,
        filename: 'Yellow Cards Export',
        url: 'http://s3:9000/injpro-staging/fake_exports',
      },
    ],
    status: 'pending',
  },
  redCards: {
    id: 1,
    name: 'Red Cards Export',
    export_type: 'red_cards_export',
    created_at: '2022-09-04T20:42:10+01:00',
    attachments: [
      {
        id: 1,
        filetype: 'text/csv',
        filesize: 250,
        filename: 'Red Cards Export',
        url: 'http://s3:9000/injpro-staging/fake_exports',
      },
    ],
    status: 'pending',
  },
};

const handlers = [
  rest.post('/export_jobs/mls_athlete_cards_export', (req, res, ctx) =>
    res(ctx.json(data.athleteCards))
  ),
  rest.post('/export_jobs/mls_staff_cards_export', (req, res, ctx) =>
    res(ctx.json(data.staffCards))
  ),
  rest.post('/export_jobs/yellow_cards_export', (req, res, ctx) =>
    res(ctx.json(data.yellowCards))
  ),
  rest.post('/export_jobs/red_cards_export', (req, res, ctx) =>
    res(ctx.json(data.redCards))
  ),
];

export { handlers, data };
