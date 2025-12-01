import { axios } from '@kitman/common/src/utils/services';
import { searchLabels } from '../searchLabels';

describe('searchLabels', () => {
  const args = {
    squadIds: [1, 2],
    isForCurrentSquadOnly: true,
  };

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({});

    await searchLabels(args);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      '/ui/planning_hub/event_activity_drill_labels',
      {
        params: {
          current_squad: args.isForCurrentSquadOnly,
          squad_ids: args.squadIds,
        },
      }
    );
  });
});
