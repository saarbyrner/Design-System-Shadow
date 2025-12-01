import $ from 'jquery';
import getDevelopmentGoals from '../getDevelopmentGoals';

const mockedData = [
  {
    id: 1,
    name: 'First development goal',
  },
  {
    id: 2,
    name: 'Second development goal',
  },
];

describe('getDevelopmentGoals', () => {
  let getDevelopmentGoalsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getDevelopmentGoalsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getDevelopmentGoals();

    expect(returnedData).toEqual(mockedData);

    expect(getDevelopmentGoalsRequest).toHaveBeenCalledTimes(1);
    expect(getDevelopmentGoalsRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: '/ui/planning_hub/development_goals',
    });
  });
});
