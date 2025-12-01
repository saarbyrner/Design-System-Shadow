// @flow
import $ from 'jquery';
import type { AthleteEvent } from '@kitman/common/src/types/Event';
import type { DevelopmentGoal } from './getDevelopmentGoals';

export type EventDevelopmentGoalItem = {
  checked: boolean,
  development_goal: DevelopmentGoal,
  development_goal_completion_type_id: ?number | string,
};

export type EventDevelopmentGoal = {
  athlete_event: AthleteEvent,
  event_development_goals: Array<EventDevelopmentGoalItem>,
};

export type EventDevelopmentGoalFiltersPayload = {
  search: string,
  athlete_ids: Array<number>,
  position_ids: Array<number>,
  development_goal_type_ids: Array<number>,
  principle_ids: Array<number>,
};

const getEventDevelopmentGoals = (
  eventId: number,
  payload: EventDevelopmentGoalFiltersPayload
): Promise<Array<EventDevelopmentGoal>> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/planning_hub/events/${eventId}/event_development_goals/search`,
      contentType: 'application/json',
      data: JSON.stringify(payload),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default getEventDevelopmentGoals;
