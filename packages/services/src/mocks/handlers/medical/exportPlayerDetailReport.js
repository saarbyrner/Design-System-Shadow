import { rest } from 'msw';
import { EXPORT_PLAYER_DETAIL_REPORT_URL } from '@kitman/services/src/services/medical/exportPlayerDetailReport';

const data = {
  id: 1,
  name: 'Player Detail Report',
  status: 'pending',
  export_type: 'player_detail_export',
  attachments: [],
  created_at: new Date().toISOString(),
};

const handler = rest.post(EXPORT_PLAYER_DETAIL_REPORT_URL, (req, res, ctx) => {
  return res(ctx.json(data));
});

export { handler, data };
