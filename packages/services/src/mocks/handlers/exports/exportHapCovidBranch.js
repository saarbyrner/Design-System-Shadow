import { rest } from 'msw';

const data = {
  id: 1,
  name: 'HAP Covid Branch',
  export_type: 'hap_covid_branch',
  created_at: '2022-09-04T20:42:10+01:00',
  attachments: [
    {
      id: 1,
      filetype: 'text/csv',
      filesize: 210,
      filename: 'HAP Covid Branch Export',
      url: 'http://s3:9000/injpro-staging/fake_exports',
    },
  ],
  status: 'pending',
};

const handler = rest.post('/export_jobs/hap_covid_branch', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
