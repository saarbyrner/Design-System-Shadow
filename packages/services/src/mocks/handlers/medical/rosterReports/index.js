import { rest } from 'msw';
import { xlsxMime } from '@kitman/common/src/utils/mediaHelper';

import {
  mockedCSVData,
  mockedXLSXData,
  mockedTimeLossBodyPartJSON,
  mockedTimeLossAllActivitiesJSON,
  mockedInjuryMedicationsJSON,
} from './data.mock';

const handler = rest.post('/medical/rosters/reports', (req, res, ctx) => {
  // eslint-disable-next-line camelcase
  const { report_type, format } = req.body;

  if (format === 'csv') {
    return res(
      ctx.set('Content-Type', 'text/csv'),
      ctx.set('Content-Disposition', 'attachment; filename="testFilename.csv"'),
      ctx.text(mockedCSVData)
    );
  }

  if (format === 'xlsx') {
    return res(
      ctx.set('Content-Type', xlsxMime),
      ctx.set(
        'Content-Disposition',
        'attachment; filename="testFilename.xlsx"'
      ),
      ctx.text(mockedXLSXData)
    );
  }

  // eslint-disable-next-line camelcase
  switch (report_type) {
    case 'time_loss_all_activities': {
      return res(ctx.json(mockedTimeLossAllActivitiesJSON));
    }
    case 'time_loss_body_part': {
      return res(ctx.json(mockedTimeLossBodyPartJSON));
    }
    case 'injury_medications': {
      return res(ctx.json(mockedInjuryMedicationsJSON));
    }
    default:
      return res(
        ctx.set('Content-Type', 'text/csv'),
        ctx.set(
          'Content-Disposition',
          'attachment; filename="testFilename.csv"'
        ),
        ctx.text(mockedCSVData)
      );
  }
});

export {
  handler,
  mockedCSVData,
  mockedTimeLossBodyPartJSON,
  mockedTimeLossAllActivitiesJSON,
  mockedInjuryMedicationsJSON,
};
