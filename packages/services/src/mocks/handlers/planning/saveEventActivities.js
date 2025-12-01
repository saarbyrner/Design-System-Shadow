// @flow
import { rest } from 'msw';
import { eventActivityGlobalStates } from '@kitman/modules/src/PlanningEvent/src/types/common';

const indeterminateData = {
  state: eventActivityGlobalStates.Indeterminate,
  count: 1,
  total_count: 2,
};

const allInData = {
  event_activity_id: 1,
  state: eventActivityGlobalStates.AllIn,
  count: 1,
  total_count: 1,
};

const handler = rest.post(
  '/ui/planning_hub/events/:eventId/event_activity_athletes/bulk_save',
  async (req, res, ctx) => {
    const requestData = await req.json();
    const [activityId] = requestData.event_activity_ids;

    if (activityId === 1) {
      return res(ctx.json([allInData]));
    }

    return res(
      ctx.json([
        {
          ...indeterminateData,
          event_activity_id: activityId,
        },
      ])
    );
  }
);

export default handler;
