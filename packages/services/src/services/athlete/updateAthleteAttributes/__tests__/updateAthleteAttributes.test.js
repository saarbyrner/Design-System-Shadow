import { axios } from '@kitman/common/src/utils/services';
import updateAthleteAttributes from '..';
import mock from '../mock';

describe('updateAthleteAttributes', () => {
  it('calls the correct endpoint and returns the correct data', async () => {
    jest.spyOn(axios, 'post');
    const { data } = await updateAthleteAttributes(1, {
      athlete_id: 12,
      squad_number: 7,
      rating_id: 3,
      disable_grid: true,
    });

    expect(data).toEqual(mock);
    expect(axios.post).toHaveBeenCalledWith(
      '/planning_hub/events/1/athlete_events/update_attributes',
      {
        athlete_id: 12,
        squad_number: 7,
        rating_id: 3,
        disable_grid: true,
      }
    );
  });
});
