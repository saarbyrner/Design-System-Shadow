import { rest } from 'msw';
import { GET_REPORT_COLUMNS_ENDPOINT } from '@kitman/services/src/services/medical/getReportColumns';

const data = [
  {
    value: 'column_1',
    label: 'Column 1',
  },
  {
    value: 'column_2',
    label: 'Column 2',
  },
  {
    value: 'column_3',
    label: 'Column 3',
  },
];

const handler = rest.get(GET_REPORT_COLUMNS_ENDPOINT, (req, res, ctx) =>
  res(ctx.json(data))
);

export { handler, data };
