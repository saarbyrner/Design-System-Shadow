import { rest } from 'msw';

const data = [
  {
    development_goal_id: 1,
    development_goal_completion_type_id: 1,
  },
  {
    development_goal_id: 3,
    development_goal_completion_type_id: 2,
  },
  {
    development_goal_id: 4,
    development_goal_completion_type_id: 3,
  },
];

const handler = rest.post(
  '/ui/planning_hub/events/:eventId/event_development_goals/bulk_save',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
