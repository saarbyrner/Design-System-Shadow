import { rest } from 'msw';

const data = {
  id: 1,
  name: 'HAP Authorization Status',
  export_type: 'hap_authorization_status',
  created_at: '2022-09-04T20:42:10+01:00',
  attachments: [
    {
      id: 1,
      filetype: 'text/csv',
      filesize: 210,
      filename: 'HAP Authorization Status Export',
      url: 'http://s3:9000/injpro-staging/fake_exports',
    },
  ],
  status: 'pending',
};

const handler = rest.post(
  '/export_jobs/hap_authorization_status',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
