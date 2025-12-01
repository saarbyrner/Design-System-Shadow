import { rest } from 'msw';

const valueData = [
  {
    value: '15.00',
  },
];

const summaryData = [
  {
    label: 'body_area',
    value: '66.7',
  },
  {
    label: 'body_area_2',
    value: '33.3',
  },
];

const groupedSummaryData = [
  {
    label: 'pathology',
    values: [
      {
        label: 'body_area',
        value: '3',
      },
    ],
  },
  {
    label: 'competitions',
    values: [
      {
        label: 'ddd',
        value: '2',
      },
      {
        label: 'abc',
        value: '23',
      },
    ],
  },
];

const data = {
  value: valueData,
  donut: summaryData,
  summary_stack: groupedSummaryData,
  line: summaryData,
  bar: summaryData,
};

const handler = rest.post(
  '/reporting/charts/preview',
  async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.json([
        {
          id: body.id,
          chart: data[body.chart_type],
          overlays: null,
          metadata: {},
        },
      ])
    );
  }
);

export { handler, data };
