import { axios } from '@kitman/common/src/utils/services';
import { searchDrills } from '../searchDrills';

describe('searchDrills', () => {
  const args = {
    search_expression: 'Searching drill names',
    principle_ids: [1, 2],
    event_activity_type_ids: [8, 6],
    user_ids: [135, 778],
  };

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({});

    await searchDrills(args);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `/planning_hub/event_activity_drills/search`,
      {
        ...args,
      }
    );
  });
});
