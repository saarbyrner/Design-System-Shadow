import { rest } from 'msw';

const AsyncJobReport = {
  id: 26,
  name: 'Daily Status Report Export',
  export_type: 'coaches_report_export',
  created_at: '2024-06-25T18:19:51+01:00',
  attachments: [
    {
      id: 3588,
      filetype: 'application/zip',
      filesize: 79713,
      filename: 'someFakeFileName.zip',
      url: 'some/fake/S3_URL.com',
    },
  ],
  status: 'pending',
};

// for V2 we ALWAYS do an async job and ALWAYS respond with the same data structure
const handler = rest.post(
  '/export_jobs/daily_status_report_export',
  async (req, res, ctx) => {
    const requestData = await req.json();

    if (requestData.format === 'CSV') {
      return res(ctx.text(AsyncJobReport));
    }

    if (requestData.format === 'PDF') {
      return res(ctx.text(AsyncJobReport));
    }

    if (requestData.grouping === null) {
      return res(ctx.json(AsyncJobReport));
    }
    if (requestData.grouping === 'position') {
      return res(ctx.json(AsyncJobReport));
    }
    return res(ctx.json(AsyncJobReport));
  }
);

export { handler, AsyncJobReport };
