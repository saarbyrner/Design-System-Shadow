import { axios } from '@kitman/common/src/utils/services';
import getEventSquads from '../getEventSquads';

describe('getEventSquads', () => {
  const eventId = 1;

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'get').mockResolvedValue({});

    await getEventSquads(eventId);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `/planning_hub/events/${eventId}/squads`,
      {
        params: {
          include_availability: false,
          include_designation: false,
          include_position_abbreviation: false,
          include_squad_number: false,
          include_game_status: false,
          filter_by_home_organisation: false,
          filter_by_away_organisation: false,
          include_primary_squad: false,
          filter_by_division: false,
        },
        timeout: 40000,
      }
    );
  });
});
