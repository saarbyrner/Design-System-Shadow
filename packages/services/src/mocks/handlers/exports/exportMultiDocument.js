import { rest } from 'msw';

const data = {
  created_at: '2022-09-02T17:10:26+01:00',
  export_type: 'multi_document',
  id: 24,
  name: 'MultiDocPrint.pdf',
  status: 'pending',
  attachments: [
    {
      id: 1,
      filetype: 'application/pdf',
      filesize: 210,
      filename: 'Multi Document Export',
      url: 'http://s3:9000/injpro-staging/fake_exports',
    },
  ],
};

const handler = rest.post('/export_jobs/multi_document', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
