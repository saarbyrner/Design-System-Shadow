import { rest } from 'msw';

const data = {
  id: 1,
  description: 'Passing enhancement from defense',
  principles: [
    {
      id: 1,
      name: 'Long pass',
      principle_categories: [],
      principle_types: [
        {
          name: 'Tecnical',
        },
      ],
      phases: [],
    },
  ],
  development_goal_types: [
    {
      id: 1,
      name: 'Tecnical',
    },
  ],
};

const handler = rest.patch(
  '/ui/planning_hub/development_goals/:developmentGoalId',
  (req, res, ctx) => res(ctx.json(data))
);

export { data, handler };
