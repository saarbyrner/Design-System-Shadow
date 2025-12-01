import { rest } from 'msw';

const data = {
  id: 1,
  name: 'Homegrown 45',
  export_type: 'homegrown_45',
  created_at: '2025-05-14T07:51:28-04:00',
  attachments: [
    {
      id: 1,
      filetype: 'text/csv',
      filesize: 250,
      filename: 'Homegrown 45',
      url: 'https://s3:9000/injpro-staging/fake_exports',
    },
  ],
  status: 'pending',
};

const handler = rest.post('/export_jobs/homegrown_45', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
