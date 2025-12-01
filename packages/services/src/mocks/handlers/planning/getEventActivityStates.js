// @flow
import { rest } from 'msw';
import { eventActivityGlobalStates } from '@kitman/modules/src/PlanningEvent/src/types/common';

const data = [
  {
    event_activity_id: 1,
    state: eventActivityGlobalStates.AllOut,
    count: 0,
    total_count: 1,
  },
  {
    event_activity_id: 2,
    state: eventActivityGlobalStates.AllIn,
    count: 1,
    total_count: 1,
  },
  {
    event_activity_id: 8,
    state: eventActivityGlobalStates.AllIn,
    count: 1,
    total_count: 1,
  },
  {
    event_activity_id: 9,
    state: eventActivityGlobalStates.Indeterminate,
    count: 1,
    total_count: 2,
  },
  {
    event_activity_id: 10,
    state: eventActivityGlobalStates.AllIn,
    count: 1,
    total_count: 1,
  },
  {
    event_activity_id: 11,
    state: eventActivityGlobalStates.AllOut,
    count: 0,
    total_count: 1,
  },
];

const handler = rest.post(
  '/ui/planning_hub/events/:eventId/event_activity_athletes/states',
  (req, res, ctx) => res(ctx.json(data))
);

export { handler, data };
