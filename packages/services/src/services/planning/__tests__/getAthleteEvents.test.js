import { axios } from '@kitman/common/src/utils/services';
import {
  getAthleteEvents,
  getAthleteEventsSortingOptions,
} from '../getAthleteEvents';

describe('getAthleteEvents', () => {
  const args = {
    eventId: 1,
    nextId: 2,
    includeEventActivitiIds: true,
    filters: {
      athleteName: 'John',
      positions: [1],
      squads: [1],
      availabilities: [''],
      participationLevels: [1],
    },
    sortBy: getAthleteEventsSortingOptions.Position,
  };

  const returnValue = { test: '' };

  beforeAll(() =>
    jest.spyOn(axios, 'post').mockResolvedValue({ data: returnValue })
  );

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    await getAthleteEvents(args);

    expect(axios.post).toHaveBeenCalledTimes(1);
    const filters = args.filters;
    expect(axios.post).toHaveBeenCalledWith(
      `/planning_hub/events/${args.eventId}/athlete_events/paginated`,
      {
        filters: {
          athlete_name: filters.athleteName,
          positions: filters.positions,
          squads: filters.squads,
          availabilities: filters.availabilities,
          participation_levels: filters.participationLevels,
        },
        sort_by: args.sortBy,
        include_event_activity_ids: args.includeEventActivityIds,
        next_id: args.nextId,
      }
    );
  });

  it('returns `data` property value from a response object', async () => {
    const athleteEvents = await getAthleteEvents(args);

    expect(athleteEvents).toMatchObject(returnValue);
  });
});
