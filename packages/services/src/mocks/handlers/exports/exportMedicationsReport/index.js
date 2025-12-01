import { rest } from 'msw';
import mockedExportResponse from '@kitman/services/src/mocks/handlers/exports/exportMedicationsReport/data.mock';

const handler = rest.post(
  '/export_jobs/medications_report_export',
  (req, res, ctx) => {
    return res(ctx.json(mockedExportResponse));
  }
);

export { handler, mockedExportResponse };
