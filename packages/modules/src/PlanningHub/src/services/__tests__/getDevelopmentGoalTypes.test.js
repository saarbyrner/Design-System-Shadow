import $ from 'jquery';
import getDevelopmentGoalTypes from '../getDevelopmentGoalTypes';
import { data as mockedData } from '../mocks/handlers/getDevelopmentGoalTypes';

describe('getDevelopmentGoalTypes', () => {
  let getDevelopmentGoalTypesRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getDevelopmentGoalTypesRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getDevelopmentGoalTypes();

    expect(returnedData).toEqual(mockedData);

    expect(getDevelopmentGoalTypesRequest).toHaveBeenCalledTimes(1);
    expect(getDevelopmentGoalTypesRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/development_goal_types?current_squad=true',
    });
  });
});
