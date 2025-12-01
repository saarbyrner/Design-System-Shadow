import 'core-js/stable/structured-clone';
import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import {
  getMatchReportEventName,
  formatMatchReportDate,
  getHomeAndAwayTeamAthletesWithTeamName,
  getStaffMembersWithTeamName,
  calculateTeamGoals,
  handleMatchReportSubEvent,
  generateInitialPenaltyShootoutActivities,
  getPlayersEligibleForPenalties,
  separateNormalGameTimeAndPenaltyActivities,
  penaltyRetrievalCheck,
  prepareBothTeamsReportData,
} from '../../utils/matchReportUtils';

describe('matchReportUtils', () => {
  describe('getMatchReportEventName', () => {
    it('returns nothing if no game event is present', () => {
      expect(getMatchReportEventName()).toEqual('');
    });

    it('returns just the opponent name if there is no org name', () => {
      expect(
        getMatchReportEventName({
          opponent_team: { name: 'Test Opponent Team' },
        })
      ).toEqual('Test Opponent Team');
    });

    it('returns the org squad name and the opponent name if both info is included', () => {
      expect(
        getMatchReportEventName({
          squad: { name: 'Test Org Name', owner_name: 'Test Owner' },
          opponent_team: { name: 'Test Opponent Team' },
        })
      ).toEqual('Test Org Name Test Owner v Test Opponent Team');
    });

    it('returns the org team name and the opponent name if both info is included', () => {
      expect(
        getMatchReportEventName({
          organisation_team: { name: 'Test Org Name' },
          opponent_team: { name: 'Test Opponent Team' },
        })
      ).toEqual('Test Org Name v Test Opponent Team');
    });
  });

  describe('formatMatchReportDate', () => {
    const mockTime = moment.tz('2024-01-07T00:00:00Z', 'GMT');
    it('returns the default date format with no FF on', () => {
      expect(formatMatchReportDate(mockTime)).toEqual(
        'January 7, 2024 12:00 AM'
      );
    });

    it('returns the standard-date-formatting date format when the FF is turned on', () => {
      window.featureFlags['standard-date-formatting'] = true;
      expect(formatMatchReportDate(mockTime)).toEqual(
        'Sunday, January 7, 2024 12:00 AM'
      );
      window.featureFlags['standard-date-formatting'] = false;
    });
  });

  describe('getHomeAndAwayTeamAthletesWithTeamName', () => {
    const athletes = [{ fullname: 'Test user 1' }, { fullname: 'Test user 2' }];
    const gameEvent = {
      home_athletes: athletes,
      away_athletes: athletes,
      squad: { owner_name: 'Test Team' },
      opponent_squad: { owner_name: 'Test Team 2' },
    };

    it('returns the scout version of the athletes with team name', () => {
      expect(
        getHomeAndAwayTeamAthletesWithTeamName({
          gameEvent,
          isScout: true,
          t: i18nextTranslateStub(),
        })
      ).toEqual({
        awayPlayers: [
          { fullname: 'Test user 1 (Test Team 2)' },
          { fullname: 'Test user 2 (Test Team 2)' },
        ],
        homePlayers: [
          { fullname: 'Test user 1 (Test Team)' },
          { fullname: 'Test user 2 (Test Team)' },
        ],
      });
    });

    it('returns the regular version of the athletes with team name', () => {
      expect(
        getHomeAndAwayTeamAthletesWithTeamName({
          gameEvent,
          isScout: false,
          t: i18nextTranslateStub(),
        })
      ).toEqual({
        awayPlayers: [
          { fullname: 'Test user 1 (Away Team)' },
          { fullname: 'Test user 2 (Away Team)' },
        ],
        homePlayers: [
          { fullname: 'Test user 1 (Home Team)' },
          { fullname: 'Test user 2 (Home Team)' },
        ],
      });
    });
  });

  describe('getStaffMembersWithTeamName', () => {
    const staff = [
      { user: { fullname: 'Test Staff 1' } },
      { user: { fullname: 'Test Staff 2' } },
    ];
    const gameEvent = {
      home_event_users: staff,
      away_event_users: staff,
      squad: { owner_name: 'Test Team' },
      opponent_squad: { owner_name: 'Test Team 2' },
    };

    it('returns the scout version of the staff with team name', () => {
      expect(
        getStaffMembersWithTeamName({
          gameEvent,
          isScout: true,
          t: i18nextTranslateStub(),
        })
      ).toEqual([
        { user: { fullname: 'Test Staff 1 (Test Team)' } },
        { user: { fullname: 'Test Staff 2 (Test Team)' } },
        { user: { fullname: 'Test Staff 1 (Test Team 2)' } },
        { user: { fullname: 'Test Staff 2 (Test Team 2)' } },
      ]);
    });

    it('returns the regular version of the staff with team name', () => {
      expect(
        getStaffMembersWithTeamName({
          gameEvent,
          isScout: false,
          t: i18nextTranslateStub(),
        })
      ).toEqual([
        { user: { fullname: 'Test Staff 1 (Home Team)' } },
        { user: { fullname: 'Test Staff 2 (Home Team)' } },
        { user: { fullname: 'Test Staff 1 (Away Team)' } },
        { user: { fullname: 'Test Staff 2 (Away Team)' } },
      ]);
    });
  });

  describe('calculateTeamGoals', () => {
    const mockEvent = {
      home_athletes: [{ id: 1 }],
      away_athletes: [{ id: 2 }],
    };
    const mockActivities = [
      { id: 1, athlete_id: 1, kind: eventTypes.goal, absolute_minute: 10 },
      {
        id: 1,
        athlete_id: 1,
        kind: eventTypes.goal,
        absolute_minute: 12,
        delete: true,
      },
      {
        id: 1,
        athlete_id: 1,
        kind: eventTypes.goal,
        absolute_minute: 13,
        delete: true,
      },
      { id: 2, athlete_id: 2, kind: eventTypes.goal, absolute_minute: 15 },
      { id: 2, athlete_id: 1, kind: eventTypes.goal, absolute_minute: 30 },
      {
        id: 2,
        athlete_id: 1,
        kind: eventTypes.goal,
        absolute_minute: 35,
        delete: true,
      },
    ];

    it('calculates the score and own goal score for home and away teams', () => {
      expect(
        calculateTeamGoals(mockEvent.away_athletes, mockActivities)
      ).toEqual({ teamScore: 1, teamOwnGoalScore: 0 });
      expect(
        calculateTeamGoals(mockEvent.home_athletes, mockActivities)
      ).toEqual({ teamScore: 2, teamOwnGoalScore: 0 });
    });

    it('calculates the total goals and own goals for a team with nested and linked own goals', () => {
      const mockActivitiesWithNestedOwnGoals = [
        ...mockActivities,
        {
          id: 3,
          athlete_id: 1,
          kind: eventTypes.goal,
          absolute_minute: 20,
        },
        {
          id: 4,
          athlete_id: 1,
          kind: eventTypes.own_goal,
          absolute_minute: 20,
          game_activity_id: 3,
        },
        {
          id: 4,
          athlete_id: 1,
          kind: eventTypes.own_goal,
          absolute_minute: 20,
          game_activity_id: 3,
          delete: true,
        },
        {
          id: 5,
          athlete_id: 1,
          kind: eventTypes.goal,
          absolute_minute: 25,
          game_activity_id: 4,
          game_activities: [
            {
              athlete_id: 1,
              kind: eventTypes.own_goal,
              absolute_minute: 25,
              game_activity_id: 5,
              minute: 25,
              organisation_id: 123,
            },
          ],
        },
      ];
      expect(
        calculateTeamGoals(
          mockEvent.home_athletes,
          mockActivitiesWithNestedOwnGoals
        )
      ).toEqual({ teamScore: 2, teamOwnGoalScore: 2 });
    });
  });

  describe('handleMatchReportSubEvent', () => {
    it('returns the appropariate sub event with the info passed in', () => {
      expect(
        handleMatchReportSubEvent(
          [],
          { id: 1, position: { id: 3 } },
          { id: 15, position: { id: 25 } }
        )
      ).toEqual([
        {
          absolute_minute: 0,
          athlete_id: 1,
          game_activities: [
            {
              absolute_minute: 0,
              athlete_id: 1,
              kind: eventTypes.position_change,
              relation: { id: 25 },
            },
            {
              absolute_minute: 0,
              athlete_id: 15,
              kind: eventTypes.position_change,
              relation: { id: 3 },
            },
          ],
          kind: eventTypes.sub,
          relation: { id: 15 },
        },
      ]);
    });
  });

  describe('generateInitialPenaltyShootoutActivities', () => {
    it('creates the initial penalty shootout activities the user would see by default', () => {
      expect(generateInitialPenaltyShootoutActivities()).toEqual({
        awayPenalties: [
          {
            absolute_minute: 1,
            athlete_id: null,
            kind: eventTypes.penalty_shootout,
            minute: 1,
          },
        ],
        homePenalties: [
          {
            absolute_minute: 1,
            athlete_id: null,
            kind: eventTypes.penalty_shootout,
            minute: 1,
          },
        ],
      });
    });
  });

  describe('separateNormalGameTimeAndPenaltyActivities', () => {
    const mockGameEvent = {
      home_athletes: [{ id: 1 }, { id: 2 }, { id: 3 }],
      away_athletes: [{ id: 4 }, { id: 5 }, { id: 6 }],
    };

    const mockNormalActivities = [
      { id: 1, kind: eventTypes.red, absolute_minute: 4, athlete_id: 1 },
      { id: 2, kind: eventTypes.goal, absolute_minute: 5, athlete_id: 3 },
      { id: 3, kind: eventTypes.goal, absolute_minute: 10, athlete_id: 6 },
    ];

    const mockPenaltyActivities = [
      {
        id: 4,
        kind: eventTypes.penalty_shootout,
        absolute_minute: 1,
        athlete_id: 3,
      },
      {
        id: 5,
        kind: eventTypes.penalty_shootout,
        absolute_minute: 1,
        athlete_id: 4,
      },
      {
        id: 6,
        kind: eventTypes.goal,
        absolute_minute: 1,
        athlete_id: 3,
        game_activity_id: 4,
      },
      {
        id: 7,
        kind: eventTypes.no_goal,
        absolute_minute: 1,
        athlete_id: 4,
        game_activity_id: 5,
      },
      {
        id: 8,
        kind: eventTypes.penalty_shootout,
        absolute_minute: 2,
        athlete_id: 2,
      },
      {
        id: 9,
        kind: eventTypes.goal,
        absolute_minute: 2,
        athlete_id: 2,
        game_activity_id: 8,
      },
    ];

    const mockCombinedActivities = [
      ...mockNormalActivities,
      ...mockPenaltyActivities,
    ];

    it('returns out the normal activities with local generated penalty activities when there are no previously saved penalties', () => {
      expect(
        separateNormalGameTimeAndPenaltyActivities(
          mockGameEvent,
          mockNormalActivities
        )
      ).toEqual({
        filteredTeamPenalties: {
          awayPenalties: [
            {
              absolute_minute: 1,
              athlete_id: null,
              kind: eventTypes.penalty_shootout,
              minute: 1,
            },
          ],
          homePenalties: [
            {
              absolute_minute: 1,
              athlete_id: null,
              kind: eventTypes.penalty_shootout,
              minute: 1,
            },
          ],
        },
        normalGameTimeActivities: mockNormalActivities,
      });
    });

    it('returns out the respective saved penalty activities and the normal activities seperated', () => {
      expect(
        separateNormalGameTimeAndPenaltyActivities(
          mockGameEvent,
          mockCombinedActivities
        )
      ).toEqual({
        filteredTeamPenalties: {
          awayPenalties: [
            {
              absolute_minute: 1,
              athlete_id: 4,
              id: 5,
              kind: eventTypes.penalty_shootout,
            },
            {
              absolute_minute: 1,
              athlete_id: 4,
              game_activity_id: 5,
              id: 7,
              kind: eventTypes.no_goal,
            },
            {
              absolute_minute: 2,
              athlete_id: null,
              kind: eventTypes.penalty_shootout,
              minute: 2,
            },
          ],
          homePenalties: [
            {
              absolute_minute: 1,
              athlete_id: 3,
              id: 4,
              kind: eventTypes.penalty_shootout,
            },
            {
              absolute_minute: 2,
              athlete_id: 2,
              id: 8,
              kind: eventTypes.penalty_shootout,
            },
            {
              absolute_minute: 1,
              athlete_id: 3,
              game_activity_id: 4,
              id: 6,
              kind: eventTypes.goal,
            },
            {
              absolute_minute: 2,
              athlete_id: 2,
              game_activity_id: 8,
              id: 9,
              kind: eventTypes.goal,
            },
          ],
        },
        normalGameTimeActivities: mockNormalActivities,
      });
    });

    it('returns out the respective away saved penalty activities and generates a unset home penalty to match', () => {
      const mockUnassignedPenalties = [
        {
          id: 11,
          kind: eventTypes.penalty_shootout,
          absolute_minute: 1,
          athlete_id: 5,
        },
        {
          id: 12,
          kind: eventTypes.goal,
          absolute_minute: 1,
          athlete_id: 5,
          game_activity_id: 11,
        },
      ];

      expect(
        separateNormalGameTimeAndPenaltyActivities(mockGameEvent, [
          ...mockNormalActivities,
          ...mockUnassignedPenalties,
        ])
      ).toEqual({
        filteredTeamPenalties: {
          awayPenalties: mockUnassignedPenalties,
          homePenalties: [
            {
              absolute_minute: 1,
              athlete_id: null,
              kind: eventTypes.penalty_shootout,
              minute: 1,
            },
          ],
        },
        normalGameTimeActivities: mockNormalActivities,
      });
    });
  });

  describe('getPlayersEligibleForPenalties', () => {
    const players = [
      { id: 123, fullname: 'Ted Danson' },
      { id: 235, fullname: 'Danny Devito' },
    ];

    const activities = [
      { kind: eventTypes.red, athlete_id: 235, absolute_minute: 10 },
    ];
    it('only returns players that do not have red card activities', () => {
      expect(getPlayersEligibleForPenalties(players, activities)).toEqual([
        players[0],
      ]);
    });
  });

  describe('penaltyRetrievalCheck', () => {
    it('returns a boolean based on if the criteria is fu-filled', () => {
      expect(
        penaltyRetrievalCheck(
          {
            absolute_minute: 1,
            delete: false,
            kind: eventTypes.penalty_shootout,
          },
          1
        )
      ).toEqual(true);
      expect(
        penaltyRetrievalCheck(
          {
            absolute_minute: 1,
            delete: false,
            kind: eventTypes.penalty_shootout,
          },
          2
        )
      ).toEqual(false);
      expect(
        penaltyRetrievalCheck(
          {
            absolute_minute: 1,
            delete: true,
            kind: eventTypes.penalty_shootout,
          },
          1
        )
      ).toEqual(false);
      expect(
        penaltyRetrievalCheck(
          { absolute_minute: 1, delete: false, kind: eventTypes.goal },
          1
        )
      ).toEqual(false);
    });
  });

  describe('prepareBothTeamsReportData', () => {
    const mockEvent = {
      home_athletes: [{ id: 1 }, { id: 3 }],
      home_event_users: [],
      away_athletes: [{ id: 2 }, { id: 4 }],
      away_event_users: [],
    };

    const homeCoords = [
      {
        id: 1,
        x: 1,
        y: 1,
        order: 1,
        position_id: 1,
        field_id: 1,
        formation_id: 1,
        position: {
          id: 1,
          abbreviation: 'GK',
        },
      },
    ];

    const awayCoords = [
      {
        id: 2,
        x: 2,
        y: 4,
        order: 1,
        position_id: 1,
        field_id: 1,
        formation_id: 1,
        position: {
          id: 1,
          abbreviation: 'CB',
        },
      },
    ];

    const mockActivities = [
      {
        kind: eventTypes.formation_change,
        absolute_minute: 0,
        relation: { id: 4, name: '4-3-2' },
      },
      { kind: eventTypes.formation_position_view_change, absolute_minute: 0 },
      { kind: eventTypes.formation_position_view_change, absolute_minute: 10 },
    ];

    it('prepares and outputs the correct converted data', () => {
      expect(
        prepareBothTeamsReportData({
          event: mockEvent,
          homeCoords,
          awayCoords,
          homeActivities: mockActivities,
          awayActivities: mockActivities,
        })
      ).toEqual({
        away: {
          formation: mockActivities[0].relation,
          formationCoordinates: {
            '2_4': awayCoords[0],
          },
          inFieldPlayers: {},
          listPlayers: [{ id: 2 }, { id: 4 }],
          players: [{ id: 2 }, { id: 4 }],
          positions: [mockActivities[0], mockActivities[1]],
          staff: [],
        },
        home: {
          formation: mockActivities[0].relation,
          formationCoordinates: {
            '1_1': homeCoords[0],
          },
          inFieldPlayers: {},
          listPlayers: [{ id: 1 }, { id: 3 }],
          players: [{ id: 1 }, { id: 3 }],
          positions: [mockActivities[0], mockActivities[1]],
          staff: [],
        },
      });
    });
  });
});
