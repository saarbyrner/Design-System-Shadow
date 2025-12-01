import $ from 'jquery';
import getDevelopmentGoalCompletionTypes from '../getDevelopmentGoalCompletionTypes';

const mockedData = [
  {
    id: 1,
    name: 'First development goal completion type',
  },
  {
    id: 2,
    name: 'Second development goal completion type',
  },
];

describe('getDevelopmentGoalCompletionTypes', () => {
  let getDevelopmentGoalCompletionTypesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getDevelopmentGoalCompletionTypesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getDevelopmentGoalCompletionTypes();

    expect(returnedData).toEqual(mockedData);

    expect(getDevelopmentGoalCompletionTypesRequest).toHaveBeenCalledTimes(1);
    expect(getDevelopmentGoalCompletionTypesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/development_goal_completion_types',
    });
  });
});
