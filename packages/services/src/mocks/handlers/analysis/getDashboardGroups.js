import { rest } from 'msw';

const GROUP_DASHBOARDS = [
  {
    id: 555,
    slug: 'workload_dashboards',
    name: 'Workload Dashboards',
    description: "A nice description that maybe we'll put in a tooltip",
    dashboards: [
      {
        id: 123,
        looker_dashboard_id: 5, // this key might change, backend to confirm
        name: 'Daily workload',
      },
      {
        id: 456,
        looker_dashboard_id: 4,
        name: 'Weekly workload',
      },
      {
        id: 789,
        looker_dashboard_id: 6,
        name: 'Game workload',
      },
    ],
  },
];

export const SINGLE_DASHBOARD = [
  {
    id: 135,
    looker_dashboard_id: 5,
    name: 'Single workload',
    description: 'A single dashboard description',
  },
];

const data = {
  dashboard_groups: GROUP_DASHBOARDS,
  dashboards: SINGLE_DASHBOARD,
};

const handler = rest.get(
  '/ui/reporting/dashboard_groups/list',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
