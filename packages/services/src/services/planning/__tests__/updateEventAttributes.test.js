import { axios } from '@kitman/common/src/utils/services';
import updateEventAttributes from '../updateEventAttributes';

describe('updateEventAttributes', () => {
  const args = {
    eventId: 73,
    athleteId: 1,
    attributes: {
      related_issue_id: 23,
      related_issue_type: 'Illness',
      participation_level: 2334,
      participation_level_reason: 2,
    },
    filters: {
      athleteName: 'John',
      positions: [1],
      squads: [1],
      availabilities: [''],
      participationLevels: [1],
    },
  };

  const argWithAthletes = {
    ...args,
    athleteId: null,
    athletes: [
      {
        id: 1,
        participation_level: 1,
      },
      {
        id: 2,
        participation_level: 2,
      },
    ],
  };

  const returnValue = { test: '' };

  it('makes a back-end call to the correct URL with the correct HTTP verb and body', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: returnValue });

    await updateEventAttributes(args);

    expect(axios.post).toHaveBeenCalledTimes(1);
    const filters = args.filters;
    expect(axios.post).toHaveBeenCalledWith(
      `/planning_hub/events/${args.eventId}/athlete_events/update_attributes`,
      {
        ...args.attributes,
        athlete_id: 1,
        filters: {
          athlete_name: filters.athleteName,
          positions: filters.positions,
          squads: filters.squads,
          availabilities: filters.availabilities,
          participation_levels: filters.participationLevels,
        },
      }
    );
  });

  it('makes a back-end call to the correct URL with the correct HTTP verb and body with athletes in request', async () => {
    jest.spyOn(axios, 'post').mockResolvedValue({ data: returnValue });

    await updateEventAttributes(argWithAthletes);

    expect(axios.post).toHaveBeenCalledTimes(1);
    const filters = args.filters;
    expect(axios.post).toHaveBeenCalledWith(
      `/planning_hub/events/${args.eventId}/athlete_events/update_attributes`,
      {
        ...args.attributes,
        athlete_id: null,
        athletes: argWithAthletes.athletes,
        filters: {
          athlete_name: filters.athleteName,
          positions: filters.positions,
          squads: filters.squads,
          availabilities: filters.availabilities,
          participation_levels: filters.participationLevels,
        },
      }
    );
  });
});
