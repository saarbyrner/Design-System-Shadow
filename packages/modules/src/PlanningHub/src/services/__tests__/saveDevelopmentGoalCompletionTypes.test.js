import $ from 'jquery';
import saveDevelopmentGoalCompletionTypes from '../saveDevelopmentGoalCompletionTypes';

describe('saveDevelopmentGoalCompletionTypes', () => {
  let saveDevelopmentGoalCompletionTypesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    saveDevelopmentGoalCompletionTypesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve([]));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    const developmentGoalCompletionTypes = [
      {
        id: 1,
        name: 'Updated development goal completion type',
      },
      {
        name: 'New development goal completion type',
      },
    ];

    await saveDevelopmentGoalCompletionTypes(developmentGoalCompletionTypes);

    expect(saveDevelopmentGoalCompletionTypesRequest).toHaveBeenCalledTimes(1);
    expect(saveDevelopmentGoalCompletionTypesRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/planning_hub/development_goal_completion_types/bulk_save',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        development_goal_completion_types: developmentGoalCompletionTypes,
      }),
    });
  });
});
