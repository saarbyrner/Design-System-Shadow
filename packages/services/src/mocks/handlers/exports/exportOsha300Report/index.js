import { rest } from 'msw';
import mockedExportResponse from '@kitman/services/src/mocks/handlers/exports/exportOsha300Report/data.mock';

const handler = rest.post(
  '/export_jobs/osha_report_export',
  (req, res, ctx) => {
    return res(ctx.json(mockedExportResponse));
  }
);

export { handler, mockedExportResponse };
