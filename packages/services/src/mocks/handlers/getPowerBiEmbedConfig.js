// @flow
import { rest } from 'msw';
import type { EmbedConfig } from '@kitman/services/src/services/getPowerBiEmbedConfig';

const data: EmbedConfig = {
  embed_token: 'H4sIAAAAAAAEACWUx66saAKD3-VsGYlYBYx0F6SfnFPBjpxzLFr97nOme--F',
  embed_url: 'https://app.powerbi.com/reportEmbed?reportId=e0a792a9-d5d1-4',
  ms_report_id: 'e0a792a9-d5d1-4280-a4e5-dc1640470ca1',
  report_id: 1,
  report_name: 'NFL Test Report',
};

const handler = rest.get('/pbi_reports/:id', (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
