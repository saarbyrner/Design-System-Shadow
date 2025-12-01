import { axios } from '@kitman/common/src/utils/services';
import searchMovementOrganisationsList from '../searchMovementOrganisationsList';

describe('searchMovementOrganisationsList', () => {
  const args = {
    user_id: 1,
    exclude_trials: false,
    exclude_trials_v2: true,
  };

  it('calls the correct URL with the correct HTTP verb and args', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({});

    await searchMovementOrganisationsList(args);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith('/ui/associations/organisations', {
      user_id: args.user_id,
      exclude_trials: args.exclude_trials,
      exclude_trials_v2: args.exclude_trials_v2,
    });
  });
});
