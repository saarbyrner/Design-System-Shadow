import { rest } from 'msw';
import mockedExportResponse from './data.mock';

const handler = rest.post(
  '/export_jobs/injury_medication_export',
  (req, res, ctx) => {
    return res(ctx.json(mockedExportResponse));
  }
);

export { handler, mockedExportResponse };
