import { rest } from 'msw';
import demographicReportData from './exportDemographicReportData.mock';
import emergencyContactsData from './emergencyContactsReportData.mock';

const handler = rest.post(
  '/medical/rosters/demographic_report/:reportType',
  (req, res, ctx) => {
    const { reportType } = req.params;

    switch (reportType) {
      case 'emergency_contacts': {
        return res(ctx.json(emergencyContactsData));
      }
      case 'x_ray_game_day':
      case 'emergency_medical': {
        return res(ctx.json(demographicReportData));
      }

      default:
        return res(ctx.json(demographicReportData));
    }
  }
);

export default handler;
