import { rest } from 'msw';
import mockedExportResponse from './data.mock';

const handler = rest.post(
  '/export_jobs/time_loss_body_part_export',
  (req, res, ctx) => {
    return res(ctx.json(mockedExportResponse));
  }
);

export { handler, mockedExportResponse };
