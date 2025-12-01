import { axios } from '@kitman/common/src/utils/services';
import deleteDevelopmentGoal from '../deleteDevelopmentGoal';

describe('deleteDevelopmentGoal', () => {
  let deleteDevelopmentGoalRequest;

  beforeEach(() => {
    deleteDevelopmentGoalRequest = jest
      .spyOn(axios, 'delete')
      .mockImplementation(
        () =>
          new Promise((resolve) => {
            return resolve({ data: null });
          })
      );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint', async () => {
    await deleteDevelopmentGoal(3);

    expect(deleteDevelopmentGoalRequest).toHaveBeenCalledTimes(1);
    expect(deleteDevelopmentGoalRequest).toHaveBeenCalledWith(
      '/ui/planning_hub/development_goals/3'
    );
  });
});
