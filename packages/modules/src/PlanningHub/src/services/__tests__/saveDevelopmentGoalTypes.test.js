import $ from 'jquery';
import saveDevelopmentGoalTypes from '../saveDevelopmentGoalTypes';

describe('saveDevelopmentGoalTypes', () => {
  let saveDevelopmentGoalTypesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    saveDevelopmentGoalTypesRequest = jest
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
        name: 'Updated development goal type',
      },
      {
        id: 2,
        delete: true,
      },
      {
        name: 'New development goal type',
      },
    ];

    await saveDevelopmentGoalTypes(developmentGoalCompletionTypes);

    expect(saveDevelopmentGoalTypesRequest).toHaveBeenCalledTimes(1);
    expect(saveDevelopmentGoalTypesRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/planning_hub/development_goal_types/bulk_save',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        development_goal_types: developmentGoalCompletionTypes,
      }),
    });
  });
});
