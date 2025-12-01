import $ from 'jquery';
import saveDevelopmentGoal from '../saveDevelopmentGoal';

const mockedDevelopmentGoal = {
  id: 1,
  description: 'Development Goal description',
  open_date: '15/20/2020',
  close_date: '20/20/2020',
};

describe('saveDevelopmentGoal', () => {
  let saveDevelopmentGoalRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    saveDevelopmentGoalRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedDevelopmentGoal));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value when editing a development goal', async () => {
    const developmentGoal = {
      id: 1,
      close_date: '20/20/2020',
    };

    const returnedData = await saveDevelopmentGoal(developmentGoal);

    expect(returnedData).toEqual(mockedDevelopmentGoal);

    expect(saveDevelopmentGoalRequest).toHaveBeenCalledTimes(1);
    expect(saveDevelopmentGoalRequest).toHaveBeenCalledWith({
      method: 'PATCH',
      url: '/ui/planning_hub/development_goals/1',
      headers: {
        'X-CSRF-Token': undefined,
      },
      contentType: 'application/json',
      data: JSON.stringify(developmentGoal),
    });
  });
});
