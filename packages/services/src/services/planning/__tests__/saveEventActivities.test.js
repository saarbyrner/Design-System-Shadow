import { axios } from '@kitman/common/src/utils/services';
import { saveEventActivities } from '../saveEventActivities';

describe('saveEventActivities', () => {
  const args = {
    value: true,
    eventId: 1,
    eventActivityIds: [1],
    filters: {
      athleteName: 'John',
      positions: [1],
      squads: [1],
      availabilities: [''],
      participationLevels: [1],
      athleteIds: [1],
    },
  };

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'post');

    await saveEventActivities(args);

    expect(axios.post).toHaveBeenCalledTimes(1);
    const filters = args.filters;
    expect(axios.post).toHaveBeenCalledWith(
      `/ui/planning_hub/events/${args.eventId}/event_activity_athletes/bulk_save`,
      {
        value: args.value,
        event_activity_ids: args.eventActivityIds,
        filters: {
          athlete_name: filters.athleteName,
          positions: filters.positions,
          squads: filters.squads,
          availabilities: filters.availabilities,
          participation_levels: filters.participationLevels,
          athlete_ids: filters.athleteIds,
        },
      }
    );
  });
});
