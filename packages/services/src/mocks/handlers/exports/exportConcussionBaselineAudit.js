import { rest } from 'msw';

const data = {
  id: 1,
  name: 'Concussion Baseline Audit',
  export_type: 'concussion_baseline_audit',
  created_at: '2022-09-04T20:42:10+01:00',
  attachments: [
    {
      id: 1,
      filetype: 'text/csv',
      filesize: 210,
      filename: 'Concussion Baseline Audit Export',
      url: 'http://s3:9000/injpro-staging/fake_exports',
    },
  ],
  status: 'pending',
};

const handler = rest.post(
  '/export_jobs/concussion_baseline_audit',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
