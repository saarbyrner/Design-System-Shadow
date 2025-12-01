import { rest } from 'msw';

const data = {
  id: 1,
  name: 'Governance Export',
  export_type: 'governance_export',
  created_at: '2022-09-04T20:42:10+01:00',
  attachments: [
    {
      id: 1,
      filetype: 'text/csv',
      filesize: 250,
      filename: 'Governance Export',
      url: 'http://s3:9000/injpro-staging/fake_exports',
    },
  ],
  status: 'pending',
};

const handler = rest.post('/export_jobs/governance_export', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
