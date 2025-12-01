import { axios } from '@kitman/common/src/utils/services';
import { data } from '@kitman/services/src/mocks/handlers/developmentGoalStandardNames/getDevelopmentGoalStandardNames';
import { GENERIC_GET_DEVELOPMENT_GOAL_STANDARD_NAMES_ENDPOINT } from '@kitman/services/src/services/developmentGoalStandardNames/getDevelopmentGoalStandardNames';
import getDevelopmentGoalStandardNames from '../getDevelopmentGoalStandardNames';

describe('getDevelopmentGoalStandardNames', () => {
  it('calls the correct endpoint', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data });

    const response = await getDevelopmentGoalStandardNames();

    expect(response).toEqual(data);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      GENERIC_GET_DEVELOPMENT_GOAL_STANDARD_NAMES_ENDPOINT
    );
  });
});
