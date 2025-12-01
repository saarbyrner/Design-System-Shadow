import $ from 'jquery';
import getEventDevelopmentGoals from '../getEventDevelopmentGoals';

const mockedData = {
  athlete_event_development_goals: [
    {
      athlete_event: {
        id: 1,
        athlete: {
          id: 1,
          firstname: 'Alain',
          lastname: 'Benjamin',
          fullname: 'Benjamin Alain',
          shortname: 'B. Alain',
          user_id: 30650,
          avatar_url:
            'https://kitman-staging.imgix.net/kitman-staff/kitman-staff.png',
          position: {
            id: 71,
            name: 'Hooker',
            order: 2,
          },
          availability: 'available',
        },
        participation_level: {
          id: 3865,
          name: 'Full',
          canonical_participation_level: 'full',
          include_in_group_calculations: true,
          default: true,
        },
        include_in_group_calculations: true,
        duration: 12,
        rpe: null,
      },
      development_goals: [
        {
          id: 1,
          description:
            'Develop your defensive awareness by scanning more often and reading the game quicker',
          start_time: '2021-09-05T23:00:00Z',
          close_time: '2021-10-14T23:00:00Z',
          principles: [
            {
              id: 1,
              name: 'Flexibility in the attacking third (with ball)',
              principle_categories: [],
              principle_types: [
                {
                  id: 1,
                  sport_id: 2,
                  sport: {
                    id: 2,
                    perma_id: 'rugby_union',
                    name: 'Rugby Union',
                    duration: 80,
                  },
                  name: 'Technical',
                },
              ],
              phases: [],
            },
          ],
          development_goal_types: [
            {
              id: 1,
              name: 'First learning objective type',
            },
          ],
        },
      ],
    },
  ],
  event_development_goals: [
    {
      development_goal_id: 1,
      development_goal_completion_type_id: null,
    },
  ],
};

describe('getEventDevelopmentGoals', () => {
  let getEventDevelopmentGoalsRequest;

  beforeEach(() => {
    const deferred = $.Deferred();
    getEventDevelopmentGoalsRequest = jest
      .spyOn($, 'ajax')
      .mockImplementation(() => deferred.resolve(mockedData));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calls the correct endpoint and returns the correct value', async () => {
    const returnedData = await getEventDevelopmentGoals('1');

    expect(returnedData).toEqual(mockedData);

    expect(getEventDevelopmentGoalsRequest).toHaveBeenCalledTimes(1);
    expect(getEventDevelopmentGoalsRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: '/ui/planning_hub/events/1/event_development_goals/search',
      contentType: 'application/json',
    });
  });
});
