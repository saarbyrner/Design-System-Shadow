import { axios } from '@kitman/common/src/utils/services';
import updateNflParticipationLevels from '../updateNflParticipationLevels';

describe('updateNflParticipationLevels', () => {
  it('calls the api endpoint with the relative info passed in', async () => {
    jest.spyOn(axios, 'post').mockImplementation(jest.fn());
    await updateNflParticipationLevels(1);
    expect(axios.post).toHaveBeenCalledWith(
      '/planning_hub/nfl_events/1/update_participation_levels'
    );
  });
});
