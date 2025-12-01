import $ from 'jquery';
import updateEventDevelopmentGoalsCompletionStatus from '../updateEventDevelopmentGoalsCompletionStatus';

describe('updateEventDevelopmentGoalsCompletionStatus', () => {
  let updateEventDevelopmentGoalsCompletionStatusRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    updateEventDevelopmentGoalsCompletionStatusRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve([]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const developmentGoalCompletionStatus = [
      {
        development_goal_id: 1,
        development_goal_completion_type_id: null,
      },
    ];

    await updateEventDevelopmentGoalsCompletionStatus(
      1,
      developmentGoalCompletionStatus
    );

    expect(
      updateEventDevelopmentGoalsCompletionStatusRequest
    ).toHaveBeenCalledTimes(1);
    expect(
      updateEventDevelopmentGoalsCompletionStatusRequest
    ).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/planning_hub/events/1/event_development_goals/bulk_save',
      contentType: 'application/json',
      data: JSON.stringify({
        event_development_goals: developmentGoalCompletionStatus,
      }),
    });
  });
});
