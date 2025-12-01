import { rest } from 'msw';
import mockedCSVData from './data.mock';

const handler = rest.post(
  '/ui/concussion/form_answers_sets/export_nba_combined_ankle_forms',
  (req, res, ctx) => {
    return res(
      ctx.set('Content-Type', 'text/csv'),
      ctx.set('Content-Disposition', 'attachment; filename="testFilename.csv"'),
      ctx.json(mockedCSVData)
    );
  }
);

export { handler, mockedCSVData };
