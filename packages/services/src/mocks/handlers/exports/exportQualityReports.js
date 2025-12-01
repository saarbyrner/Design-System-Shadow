import { rest } from 'msw';

const data = {
  id: 1,
  name: 'Exposure Quality Check',
  export_type: 'quality_reports',
  created_at: '2022-09-04T20:42:10+01:00',
  attachments: [
    {
      id: 1,
      filetype: 'text/csv',
      filesize: 210,
      filename: 'Exposure Quality Check Export',
      url: 'http://s3:9000/injpro-staging/fake_exports',
    },
  ],
  status: 'pending',
};

const handler = rest.post(
  '/export_jobs/exposure_quality_check',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
