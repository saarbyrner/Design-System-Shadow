// @flow
import $ from 'jquery';

export type EventDevelopmentGoalsCompletionStatus = {
  development_goal_id: number | string,
  development_goal_completion_type_id?: ?number | string,
  delete?: boolean,
};

const updateEventDevelopmentGoalsCompletionStatus = (
  eventId: number,
  eventDevelopmentGoalsCompletionStatus: Array<EventDevelopmentGoalsCompletionStatus>
): Promise<Array<EventDevelopmentGoalsCompletionStatus>> => {
  return new Promise((resolve, reject) => {
    $.ajax({
      method: 'POST',
      url: `/ui/planning_hub/events/${eventId}/event_development_goals/bulk_save`,
      contentType: 'application/json',
      data: JSON.stringify({
        event_development_goals: eventDevelopmentGoalsCompletionStatus,
      }),
    })
      .done(resolve)
      .fail(reject);
  });
};

export default updateEventDevelopmentGoalsCompletionStatus;
