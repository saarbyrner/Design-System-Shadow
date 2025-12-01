import { axios } from '@kitman/common/src/utils/services';
import { searchPrinciples } from '../searchPrinciples';

describe('searchPrinciples', () => {
  const args = {
    squadIds: [1, 2],
    isForCurrentSquadOnly: true,
  };

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({});

    await searchPrinciples(args);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      '/ui/planning_hub/principles/search',
      {
        current_squad: args.isForCurrentSquadOnly,
        squad_ids: args.squadIds,
      }
    );
  });
});
