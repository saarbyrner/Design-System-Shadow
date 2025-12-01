import { axios } from '@kitman/common/src/utils/services';
import { athleteAvailabilities } from '@kitman/common/src/types/Event';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import {
  checkIfPlayersHaveActivity,
  findFormationForPeriod,
  getMostRecentFormation,
  findIndexOfFormationForPeriod,
  onCreateFormationActivity,
  onUpdatedFormation,
  findMostRecentFormationsForPeriod,
  createPlayerFormationViewChange,
  findActivityForThePosition,
  findPeriodPositionChangeActivityForAthlete,
  findPeriodFormationCompleteActivity,
  findPeriodPlayerPitchChangeActivities,
  updatePlayerFormationViewChange,
  getGoals,
  getOwnGoals,
  getRedCard,
  getRedCardForSecondYellow,
  getSubs,
  getSwitches,
  getYellowCards,
  canEditSubSwapGameActivity,
  getGameActivitiesByType,
  getEventPositionActivitiesIndexes,
  getLinkedActivitiesFromEvent,
  getLinkedActivitiesIndexesFromEvent,
  handleFootballMultiPlayerPitchEvent,
  getOldActivities,
  createGameEventsFromSavedLineUpTemplate,
  transformListViewActivitiesWithPitchViewCompatability,
  generateNewFormationPlayerActivities,
  updateFormationPlayerActivities,
  handleTeamUpdatedFormationAssignments,
  getAthletePositionData,
  getAthleteCurrentPosition,
  createFormationCompleteActivity,
  removeFormationComplete,
  getCaptainForTeamActivity,
  doesOwnGoalExistForEvent,
  updateGameActivitiesForOwnGoal,
} from '../gameActivityUtils';

describe('Game Activity Utils', () => {
  describe('checkIfPlayersHaveActivity', () => {
    const mockGameActivities = [
      {
        absolute_minute: 0,
        relation_id: null,
        kind: eventTypes.goal,
        athlete_id: 1111,
      },
      {
        absolute_minute: 50,
        relation_id: null,
        kind: eventTypes.goal,
        athlete_id: 2222,
      },
    ];

    it('returns an activity if there exists one that matches one of the player ids passed in', () => {
      expect(checkIfPlayersHaveActivity(mockGameActivities, ['1111'])).toEqual(
        mockGameActivities[0]
      );
    });
  });

  describe('formation activity utils', () => {
    const period = {
      id: 1,
      duration: 50,
      absolute_duration_start: 0,
      absolute_duration_end: 50,
      name: 'Period 1',
    };

    const mockGameActivities = [
      {
        absolute_minute: 0,
        relation: { id: 4 },
        kind: eventTypes.formation_change,
      },
      {
        absolute_minute: 50,
        relation: { id: 5 },
        kind: eventTypes.formation_change,
      },
    ];

    it('getMostRecentFormation returns the most recent formation', () => {
      const recentFormation = {
        absolute_minute: 35,
        relation: { id: 8 },
        kind: eventTypes.formation_change,
      };
      expect(
        getMostRecentFormation([...mockGameActivities, recentFormation], period)
      ).toEqual(recentFormation);
    });

    it('findFormationForPeriod returns a formation activity in the activity list', () => {
      expect(findFormationForPeriod(mockGameActivities, period)).toEqual(
        mockGameActivities[0]
      );
    });

    it('findIndexOfFormationForPeriod returns an index for formation activity in the activity list', () => {
      expect(findIndexOfFormationForPeriod(mockGameActivities, period)).toEqual(
        0
      );
    });

    it('onCreateFormationActivity creates the formation activity when the details are passed in', () => {
      expect(onCreateFormationActivity(2, { id: 4, name: '4-4-2' })).toEqual({
        absolute_minute: 2,
        minute: 0,
        kind: eventTypes.formation_change,
        relation: { id: 4, name: '4-4-2' },
      });
    });

    it('onUpdatedFormation returns the updated formation activity when the id is changed', () => {
      expect(
        onUpdatedFormation(mockGameActivities, period, {
          id: 10,
          name: '3-3-2',
        })
      ).toEqual([
        {
          absolute_minute: 0,
          kind: eventTypes.formation_change,
          relation: { id: 10, name: '3-3-2' },
        },
        {
          absolute_minute: 50,
          kind: eventTypes.formation_change,
          relation: { id: 5 },
        },
      ]);
    });
  });

  describe('player assignment utils', () => {
    const period = {
      id: 1,
      duration: 50,
      absolute_duration_start: 0,
      absolute_duration_end: 50,
      name: 'Period 1',
    };

    const gameActivities = [
      {
        athlete_id: 2,
        absolute_minute: 0,
        kind: eventTypes.formation_position_view_change,
        relation: {
          id: 5,
          position: {
            id: 50,
            abbreviation: 'GK',
          },
        },
        game_period_id: 1,
      },
      {
        athlete_id: 2,
        absolute_minute: 0,
        kind: eventTypes.position_change,
        relation: { id: 10 },
      },
      {
        absolute_minute: 0,
        kind: eventTypes.formation_complete,
        relation_id: 1,
      },
    ];

    it('findPeriodPlayerPitchChangeActivities returns if there exists a player pitch view activity', () => {
      expect(
        findPeriodPlayerPitchChangeActivities(gameActivities, period)
      ).toEqual([gameActivities[0]]);
    });

    it('findPeriodFormationCompleteActivity returns the respective activity if the formation_complete exists for the period', () => {
      expect(
        findPeriodFormationCompleteActivity(gameActivities, period)
      ).toEqual(gameActivities[2]);
    });

    it('findPeriodPositionChangeActivityForAthlete returns the respective first position_change element that exists for the period', () => {
      expect(
        findPeriodPositionChangeActivityForAthlete(gameActivities, 2, period)
      ).toEqual(gameActivities[1]);
    });

    it('findActivityForThePosition returns the respective activity that matches the positionID passed in', () => {
      expect(
        findActivityForThePosition({
          gameActivities,
          positionId: 5,
          currentPeriodMinute: 0,
          positionType: eventTypes.formation_position_view_change,
        })
      ).toEqual(gameActivities[0]);
    });

    it('findMostRecentFormationsForPeriod returns the respective formations in recent order', () => {
      const formationActivities = [
        ...gameActivities,
        {
          absolute_minute: 0,
          kind: eventTypes.formation_change,
          relation: { id: 1 },
        },
        {
          absolute_minute: 10,
          kind: eventTypes.formation_change,
          relation: { id: 5 },
        },
      ];
      expect(
        findMostRecentFormationsForPeriod(formationActivities, {
          absolute_duration_start: 0,
          absolute_duration_end: 90,
        })
      ).toEqual([
        {
          absolute_minute: 10,
          kind: eventTypes.formation_change,
          relation: { id: 5 },
        },
        {
          absolute_minute: 0,
          kind: eventTypes.formation_change,
          relation: { id: 1 },
        },
      ]);
    });

    it('expects createPlayerFormationViewChange to return the respective events when a player is assigned', () => {
      const positionInfo = { id: 1, position: { id: 3 } };

      expect(
        createPlayerFormationViewChange({
          playerId: 4,
          positionInfo,
          periodMin: 0,
        })
      ).toEqual([
        {
          absolute_minute: 0,
          minute: 0,
          athlete_id: 4,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 1 },
        },
        {
          absolute_minute: 0,
          minute: 0,
          athlete_id: 4,
          kind: eventTypes.position_change,
          relation: { id: 3 },
        },
      ]);
    });

    it('expects updatePlayerFormationViewChange to update the respective events when a player is assigned', () => {
      expect(
        updatePlayerFormationViewChange({
          gameActivities,
          playerId: 5,
          prevPlayerId: 2,
          currentPeriodMinute: 0,
        })
      ).toEqual([
        {
          absolute_minute: 0,
          athlete_id: 5,
          kind: eventTypes.formation_position_view_change,
          relation: {
            id: 5,
            position: {
              id: 50,
              abbreviation: 'GK',
            },
          },
          game_period_id: 1,
        },
        {
          absolute_minute: 0,
          athlete_id: 5,
          kind: eventTypes.position_change,
          relation: { id: 10 },
        },
        {
          absolute_minute: 0,
          kind: eventTypes.formation_complete,
          relation_id: 1,
        },
      ]);
    });

    it('expects getAthletePositionData to return the correctly formatted object from the Game Activity', () => {
      expect(getAthletePositionData(gameActivities[0])).toEqual({
        id: 5,
        position: { id: 50, abbreviation: 'GK' },
      });
    });

    it('expects getAthleteCurrentPosition to return the most recent formation_position_view_change game activity within the period', () => {
      expect(getAthleteCurrentPosition(gameActivities, 2, period)).toEqual({
        kind: eventTypes.formation_position_view_change,
        athlete_id: 2,
        absolute_minute: 0,
        relation: {
          id: 5,
          position: {
            id: 50,
            abbreviation: 'GK',
          },
        },
        game_period_id: 1,
      });
    });
  });

  describe('Event List info retrieval utils', () => {
    const activities = [
      { id: 1, kind: eventTypes.goal, absolute_minute: 0, athlete_id: 2222 },
      { id: 2, kind: eventTypes.yellow, absolute_minute: 0, athlete_id: 2222 },
      { id: 3, kind: eventTypes.yellow, absolute_minute: 5, athlete_id: 2222 },
      {
        id: 4,
        kind: eventTypes.red,
        absolute_minute: 5,
        athlete_id: 2222,
      },
      { id: 5, kind: eventTypes.switch, absolute_minute: 5, athlete_id: 2222 },
      { id: 6, kind: eventTypes.sub, absolute_minute: 5, athlete_id: 2222 },
      { id: 7, kind: eventTypes.yellow, absolute_minute: 0, user_id: 4444 },
      { id: 8, kind: eventTypes.yellow, absolute_minute: 5, user_id: 4444 },
      { id: 9, kind: eventTypes.red, absolute_minute: 5, user_id: 4444 },
      { id: 10, kind: eventTypes.assist, absolute_minute: 0, user_id: 4444 },
      { id: 11, kind: eventTypes.sub, absolute_minute: 3, athlete_id: 2222 },
      {
        id: 12,
        kind: eventTypes.yellow,
        absolute_minute: 0,
        athlete_id: 2222,
        delete: true,
      },
      {
        id: 19,
        kind: eventTypes.red,
        absolute_minute: 4,
        athlete_id: 2222,
        delete: true,
      },
      {
        id: 13,
        kind: eventTypes.goal,
        absolute_minute: 0,
        athlete_id: 2222,
        delete: true,
      },
      {
        id: 23,
        kind: eventTypes.switch,
        absolute_minute: 3,
        athlete_id: 2222,
        delete: true,
      },
      {
        id: 20,
        kind: eventTypes.sub,
        absolute_minute: 3,
        athlete_id: 2222,
        delete: true,
      },
      {
        id: 40,
        kind: eventTypes.captain_assigned,
        absolute_minute: 0,
        athlete_id: 1111111,
      },
      {
        id: 13,
        kind: eventTypes.own_goal,
        absolute_minute: 0,
        athlete_id: 2222,
      },
      {
        id: 14,
        kind: eventTypes.own_goal,
        absolute_minute: 0,
        athlete_id: 2222,
        delete: true,
      },
    ];

    it('returns the assigned captain activity when getCaptainForTeamActivity is called', () => {
      expect(getCaptainForTeamActivity(activities)).toEqual({
        id: 40,
        kind: eventTypes.captain_assigned,
        absolute_minute: 0,
        athlete_id: 1111111,
      });
    });

    it('returns a list of yellow card when getYellowCards is called', () => {
      expect(getYellowCards(activities, 2222)).toEqual([
        {
          id: 2,
          kind: eventTypes.yellow,
          absolute_minute: 0,
          athlete_id: 2222,
        },
        {
          id: 3,
          kind: eventTypes.yellow,
          absolute_minute: 5,
          athlete_id: 2222,
        },
      ]);
      expect(getYellowCards(activities, 4444)).toEqual([
        { id: 7, kind: eventTypes.yellow, absolute_minute: 0, user_id: 4444 },
        { id: 8, kind: eventTypes.yellow, absolute_minute: 5, user_id: 4444 },
      ]);
    });

    it('returns a red card if it exists when getRedCard is called', () => {
      expect(getRedCard(activities, 2222)).toEqual({
        id: 4,
        kind: eventTypes.red,
        absolute_minute: 5,
        athlete_id: 2222,
      });
      expect(getRedCard(activities, 4444)).toEqual({
        id: 9,
        kind: eventTypes.red,
        absolute_minute: 5,
        user_id: 4444,
      });
    });

    it('returns a list of goals when getGoals is called', () => {
      expect(getGoals(activities, 2222)).toEqual([
        { id: 1, kind: eventTypes.goal, absolute_minute: 0, athlete_id: 2222 },
      ]);
    });

    it('returns a list of own goals that are linked to the athlete game activity when getOwnGoals is called', () => {
      expect(getOwnGoals(activities, 2222)).toEqual([activities[17]]);
    });

    it('returns a list of own goals that are nested within the athlete game activity when getOwnGoals is called', () => {
      const nestedOwnGoalActivities = [
        {
          id: 1,
          kind: eventTypes.goal,
          absolute_minute: 0,
          athlete_id: 2222,
          game_activities: [
            {
              athlete_id: 2222,
              kind: eventTypes.own_goal,
              absolute_minute: 0,
              relation_id: null,
            },
          ],
        },
      ];
      expect(getOwnGoals(nestedOwnGoalActivities, 2222)).toEqual([
        nestedOwnGoalActivities[0].game_activities[0],
      ]);
    });

    it('excludes nested own goals under a parent activity marked for deletion when ownGoals is called', () => {
      const nestedOwnGoalActivities = [
        {
          id: 1,
          kind: eventTypes.goal,
          absolute_minute: 0,
          athlete_id: 2222,
          delete: true,
          game_activities: [
            {
              athlete_id: 2222,
              kind: eventTypes.own_goal,
              absolute_minute: 0,
              relation_id: null,
            },
          ],
        },
      ];
      expect(getOwnGoals(nestedOwnGoalActivities, 2222)).toEqual([]);
    });

    it('returns a red card if it exists for the specified second yellow card and athlete when getRedCardForSecondYellow is called', () => {
      expect(getRedCardForSecondYellow(activities, 2222, 5)).toEqual({
        id: 4,
        kind: eventTypes.red,
        absolute_minute: 5,
        athlete_id: 2222,
      });
    });

    it('returns the switch events when getSwitches is called', () => {
      expect(getSwitches(activities, 2222)).toEqual([activities[4]]);
    });

    it('returns the substitution events when getSubs is called', () => {
      expect(getSubs(activities, 2222)).toEqual([
        activities[5],
        activities[10],
      ]);
    });

    it('returns the correct response (true) when canEditSubSwapGameActivity is called for the most recent sub / swap game activity', () => {
      expect(canEditSubSwapGameActivity(activities, activities[5])).toEqual(
        true
      );
    });

    it('returns the correct response (false) when canEditSubSwapGameActivity is called for an activity that is not the most recent sub / swap game activity', () => {
      expect(canEditSubSwapGameActivity(activities, activities[4])).toEqual(
        false
      );
      expect(canEditSubSwapGameActivity(activities, activities[10])).toEqual(
        false
      );
    });

    it('returns the correct response (true) when canEditSubSwapGameActivity is called for an activity that is not a sub / swap game activity', () => {
      expect(canEditSubSwapGameActivity(activities, activities[0])).toEqual(
        true
      );
    });

    it('returns the correct events, in the correct order, when getGameActivitiesByType is called', () => {
      expect(getGameActivitiesByType(activities, [eventTypes.goal])).toEqual([
        activities[0],
      ]);
      expect(
        getGameActivitiesByType(activities, [eventTypes.sub, eventTypes.switch])
      ).toEqual([activities[5], activities[4], activities[10]]);
      expect(getGameActivitiesByType(activities, [eventTypes.red])).toEqual([
        activities[8],
        activities[3],
      ]);
      expect(
        getGameActivitiesByType(activities, [
          eventTypes.goal,
          eventTypes.assist,
        ])
      ).toEqual([activities[9], activities[0]]);
      expect(getGameActivitiesByType(activities, [eventTypes.yellow])).toEqual([
        activities[7],
        activities[2],
        activities[6],
        activities[1],
      ]);
    });
  });

  describe('Multi Event Activity Utils', () => {
    const mockActivities = [
      {
        athlete_id: 1,
        absolute_minute: 0,
        relation: {
          id: 4,
        },
        kind: eventTypes.position_change,
        game_activity_id: 1,
      },
      {
        athlete_id: 2,
        absolute_minute: 0,
        relation: {
          id: 5,
        },
        kind: eventTypes.position_change,
        game_activity_id: 1,
      },
      {
        athlete_id: 1,
        absolute_minute: 0,
        relation: {
          id: 4,
        },
        kind: eventTypes.formation_position_view_change,
        game_activity_id: 1,
      },
      {
        athlete_id: 2,
        absolute_minute: 0,
        relation: {
          id: 5,
        },
        kind: eventTypes.formation_position_view_change,
        game_activity_id: 1,
      },
    ];
    const mockFlatActivities = [
      {
        id: 1,
        athlete_id: 1,
        absolute_minute: 0,
        relation: {
          id: 2,
        },
        kind: eventTypes.switch,
        game_activity_id: 1,
      },
      ...mockActivities,
    ];

    it('returns a list of events for the swap/sub when getLinkedActivitiesFromEvent is called', () => {
      expect(
        getLinkedActivitiesFromEvent({
          gameActivities: mockFlatActivities,
          event: mockFlatActivities[0],
          type: eventTypes.formation_position_view_change,
        })
      ).toEqual([
        {
          absolute_minute: 0,
          athlete_id: 1,
          game_activity_id: 1,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 4 },
        },
        {
          absolute_minute: 0,
          athlete_id: 2,
          game_activity_id: 1,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 5 },
        },
      ]);
    });

    it('returns a list of indexes for the swap/sub when getLinkedActivitiesIndexesFromEvent is called with returnIndex prop', () => {
      expect(
        getLinkedActivitiesIndexesFromEvent(
          mockFlatActivities,
          mockFlatActivities[0],
          eventTypes.formation_position_view_change
        )
      ).toEqual([3, 4]);
    });

    it('returns a list of indexes for the activities when getEventPositionActivitiesIndexes is called', () => {
      expect(
        getEventPositionActivitiesIndexes(mockFlatActivities, 1, null)
      ).toEqual([1, 2, 3, 4]);
      expect(
        getEventPositionActivitiesIndexes(
          mockFlatActivities,
          1,
          eventTypes.position_change
        )
      ).toEqual([1, 2]);
      expect(
        getEventPositionActivitiesIndexes(
          mockFlatActivities,
          1,
          eventTypes.formation_position_view_change
        )
      ).toEqual([3, 4]);
    });
  });

  describe('handleFootballMultiPlayerPitchEvent', () => {
    it('returns an switch nested activity group', () => {
      expect(
        handleFootballMultiPlayerPitchEvent({
          athleteId: 5444,
          eventType: eventTypes.switch,
          positionData: {
            id: 5,
            position: {
              id: 4,
            },
          },
          pitchActivities: [{ kind: eventTypes.switch, absolute_minute: 10 }],
          periodStartTime: 0,
          selectedPitchPlayer: {
            player: { id: 4 },
            positionData: { id: 6, position: { id: 7 } },
          },
        })
      ).toEqual([
        {
          absolute_minute: 10,
          minute: 10,
          athlete_id: 4,
          game_activities: [
            {
              absolute_minute: 10,
              minute: 10,
              athlete_id: 4,
              kind: eventTypes.position_change,
              relation: { id: 4 },
            },
            {
              absolute_minute: 10,
              minute: 10,
              athlete_id: 5444,
              kind: eventTypes.position_change,
              relation: { id: 7 },
            },
            {
              absolute_minute: 10,
              minute: 10,
              athlete_id: 4,
              kind: eventTypes.formation_position_view_change,
              relation: { id: 5 },
            },
            {
              absolute_minute: 10,
              minute: 10,
              athlete_id: 5444,
              kind: eventTypes.formation_position_view_change,
              relation: { id: 6 },
            },
          ],
          kind: eventTypes.switch,
          relation: { id: 5444 },
        },
      ]);
    });

    it('returns a substitute nested activity group', () => {
      expect(
        handleFootballMultiPlayerPitchEvent({
          athleteId: 5444,
          eventType: eventTypes.sub,
          positionData: {
            id: 5,
            position: {
              id: 4,
            },
          },
          pitchActivities: [],
          periodStartTime: 0,
          selectedPitchPlayer: {
            player: undefined,
            positionData: { id: 6, position: { id: 7 } },
          },
        })
      ).toEqual([
        {
          absolute_minute: 0,
          minute: 0,
          athlete_id: null,
          game_activities: [
            {
              absolute_minute: 0,
              minute: 0,
              athlete_id: 5444,
              kind: eventTypes.position_change,
              relation: { id: 7 },
            },
            {
              absolute_minute: 0,
              minute: 0,
              athlete_id: 5444,
              kind: eventTypes.formation_position_view_change,
              relation: { id: 6 },
            },
          ],
          kind: eventTypes.sub,
          relation: { id: 5444 },
        },
      ]);
    });
  });

  describe('createGameEventsFromSavedLineUpTemplate', () => {
    const mockCurrentPeriod = {
      absolute_duration_start: 10,
      absolute_duration_end: 40,
    };
    const mockLineUpTemplate = {
      formation: {
        id: 1,
        name: '5-4-1',
        number_of_players: 11,
      },
      formation_id: 1,
      lineup_positions: [
        {
          formation_position_view: { x: 1, y: 2, id: 1, position: { id: 1 } },
          athlete_id: 101,
        },
        {
          formation_position_view: { x: 2, y: 3, id: 2, position: { id: 2 } },
          athlete_id: 102,
        },
      ],
    };
    const mockGameActivities = [
      { absolute_minute: 5 },
      {
        absolute_minute: 10,
        athlete_id: null,
        kind: eventTypes.formation_change,
        relation: { id: 5 },
      },
      { absolute_minute: 15 },
    ];
    const mockPlayers = [
      {
        id: 101,
        name: 'Player 1',
        availability: athleteAvailabilities.Available,
      },
      {
        id: 102,
        name: 'Player 2',
        availability: athleteAvailabilities.Available,
      },
    ];

    const expectedEvents = [
      { absolute_minute: 5 },
      { absolute_minute: 15 },
      {
        absolute_minute: 10,
        athlete_id: null,
        kind: eventTypes.formation_change,
        relation: {
          id: 1,
          name: '5-4-1',
          number_of_players: 11,
        },
      },
      {
        absolute_minute: 10,
        minute: 0,
        athlete_id: 101,
        kind: eventTypes.formation_position_view_change,
        relation: {
          id: mockLineUpTemplate.lineup_positions[0].formation_position_view.id,
        },
      },
      {
        absolute_minute: 10,
        minute: 0,
        athlete_id: 101,
        kind: eventTypes.position_change,
        relation: { id: 1 },
      },
      {
        absolute_minute: 10,
        minute: 0,
        athlete_id: 102,
        kind: eventTypes.formation_position_view_change,
        relation: {
          id: mockLineUpTemplate.lineup_positions[1].formation_position_view.id,
        },
      },
      {
        absolute_minute: 10,
        minute: 0,
        athlete_id: 102,
        kind: eventTypes.position_change,
        relation: { id: 2 },
      },
    ];

    const expectedInFieldPlayers = {
      '1_2': {
        id: 101,
        name: 'Player 1',
        availability: athleteAvailabilities.Available,
      },
      '2_3': {
        id: 102,
        name: 'Player 2',
        availability: athleteAvailabilities.Available,
      },
    };

    it('should add new game events and populate in field players', () => {
      const result = createGameEventsFromSavedLineUpTemplate({
        currentPeriod: mockCurrentPeriod,
        lineUpTemplate: mockLineUpTemplate,
        gameActivities: mockGameActivities,
        players: mockPlayers,
      });

      expect(result.events).toEqual(expectedEvents);
      expect(result.inFieldPlayers).toEqual(expectedInFieldPlayers);
    });

    it('should handle empty gameActivities', () => {
      const result = createGameEventsFromSavedLineUpTemplate({
        currentPeriod: mockCurrentPeriod,
        lineUpTemplate: mockLineUpTemplate,
        gameActivities: [
          {
            absolute_minute: 10,
            athlete_id: null,
            kind: eventTypes.formation_change,
            relation: { id: 1 },
          },
        ],
        players: mockPlayers,
      });

      expect(result.events).toEqual([
        {
          absolute_minute: 10,
          athlete_id: null,
          kind: eventTypes.formation_change,
          relation: {
            id: 1,
            name: '5-4-1',
            number_of_players: 11,
          },
        },
        {
          absolute_minute: 10,
          minute: 0,
          athlete_id: 101,
          kind: eventTypes.formation_position_view_change,
          relation: {
            id: mockLineUpTemplate.lineup_positions[0].formation_position_view
              .id,
          },
        },
        {
          absolute_minute: 10,
          minute: 0,
          athlete_id: 101,
          kind: eventTypes.position_change,
          relation: { id: 1 },
        },
        {
          absolute_minute: 10,
          minute: 0,
          athlete_id: 102,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 2 },
        },
        {
          absolute_minute: 10,
          minute: 0,
          athlete_id: 102,
          kind: eventTypes.position_change,
          relation: {
            id: 2,
          },
        },
      ]);
      expect(result.inFieldPlayers).toEqual(expectedInFieldPlayers);
    });

    it('should handle no players', () => {
      const result = createGameEventsFromSavedLineUpTemplate({
        currentPeriod: mockCurrentPeriod,
        lineUpTemplate: mockLineUpTemplate,
        gameActivities: mockGameActivities,
        players: [],
      });

      expect(result.inFieldPlayers).toEqual({});
    });
  });

  describe('getOldActivities', () => {
    const currentPeriod = {
      absolute_duration_start: 0,
      absolute_duration_end: 40,
    };
    const formationId = 2;
    it('should return old activities with relation id updated with formation_id for formation_change activity', () => {
      const gameActivities = [
        {
          id: 1,
          kind: eventTypes.formation_change,
          relation: {
            id: 1,
            name: 'formation name',
          },
          absolute_minute: 20,
        },
      ];

      const result = getOldActivities({
        gameActivities,
        currentPeriod,
        formationId,
      });

      const expectedActivities = [
        {
          absolute_minute: 20,
          id: 1,
          kind: eventTypes.formation_change,
          relation: {
            id: 2,
            name: 'formation name',
          },
        },
      ];

      expect(result).toEqual(expectedActivities);
    });

    it('should return old activities with delete flag', () => {
      const gameActivities = [
        {
          id: 1,
          kind: eventTypes.formation_position_view_change,
          absolute_minute: 20,
        },
      ];

      const result = getOldActivities({
        gameActivities,
        currentPeriod,
        formationId,
      });

      const expectedActivities = [
        {
          absolute_minute: 20,
          id: 1,
          kind: eventTypes.formation_position_view_change,
          delete: true,
        },
      ];

      expect(result).toEqual(expectedActivities);
    });

    it('should return an empty array when there are no old activities', () => {
      const gameActivities = [
        {
          id: 1,
          kind: eventTypes.formation_change,
        },
      ];

      const result = getOldActivities({
        gameActivities,
        currentPeriod,
        formationId,
      });

      expect(result).toEqual([]);
    });

    it('should return an empty array when gameActivities is empty', () => {
      const gameActivities = [];

      const result = getOldActivities({
        gameActivities,
        currentPeriod,
        formationId,
      });

      expect(result).toEqual([]);
    });

    it('should return old activities as well as existing activities marked for delete', () => {
      const gameActivities = [
        {
          id: 1,
          kind: eventTypes.formation_position_view_change,
          absolute_minute: 20,
        },
        {
          id: 2,
          kind: eventTypes.goal,
          absolute_minute: 20,
          athlete_id: 2222,
          delete: true,
        },
      ];

      const result = getOldActivities({
        gameActivities,
        currentPeriod,
        formationId,
      });

      expect(result).toEqual([
        {
          id: 1,
          kind: eventTypes.formation_position_view_change,
          absolute_minute: 20,
          delete: true,
        },
        gameActivities[1],
      ]);
    });

    it('should return activity kind captain_assigned without delete prop', () => {
      const gameActivities = [
        {
          id: 1,
          kind: eventTypes.goal,
          absolute_minute: 20,
          athlete_id: 2222,
          delete: true,
        },
        {
          id: 2,
          kind: eventTypes.captain_assigned,
          absolute_minute: 0,
          athlete_id: 2222,
        },
      ];

      const result = getOldActivities({
        gameActivities,
        currentPeriod,
        formationId,
      });

      expect(result).toEqual([
        {
          absolute_minute: 20,
          athlete_id: 2222,
          delete: true,
          id: 1,
          kind: 'goal',
        },
        {
          absolute_minute: 0,
          athlete_id: 2222,
          id: 2,
          kind: 'captain_assigned',
        },
      ]);
    });
  });

  describe('transformListViewActivitiesWithPitchViewCompatability', () => {
    const mockFormationCoordinates = {
      '2_5': {
        id: 1,
        position: {
          id: 1,
        },
      },
      '3_4': {
        id: 2,
        position: {
          id: 1,
        },
      },
    };

    const mockActivities = [
      {
        absolute_minute: 0,
        kind: eventTypes.formation_position_view_change,
        athlete_id: 2,
        relation: { id: 1 },
      },
    ];

    it('creates the respective formation_position_view_change for the second formation coordinate when the position_change is being created', () => {
      expect(
        transformListViewActivitiesWithPitchViewCompatability(
          mockActivities,
          [
            {
              absolute_minute: 0,
              kind: eventTypes.position_change,
              athlete_id: 2,
              relation_id: 1,
            },
          ],
          mockFormationCoordinates
        )
      ).toEqual([
        {
          absolute_minute: 0,
          athlete_id: 2,
          kind: eventTypes.formation_position_view_change,
          relation_id: 2,
        },
        {
          absolute_minute: 0,
          athlete_id: 2,
          kind: eventTypes.position_change,
          relation_id: 1,
        },
      ]);
    });

    it('creates the respective red_card for the second yellow card when passed in', () => {
      expect(
        transformListViewActivitiesWithPitchViewCompatability(
          mockActivities,
          [
            {
              absolute_minute: 0,
              kind: eventTypes.yellow,
              athlete_id: 2,
              relation_id: null,
            },
            {
              absolute_minute: 10,
              kind: eventTypes.yellow,
              athlete_id: 2,
              relation_id: null,
            },
          ],
          mockFormationCoordinates
        )
      ).toEqual([
        {
          absolute_minute: 10,
          athlete_id: 2,
          kind: eventTypes.red,
          relation_id: null,
        },
        {
          absolute_minute: 0,
          athlete_id: 2,
          kind: eventTypes.yellow,
          relation_id: null,
        },
        {
          absolute_minute: 10,
          athlete_id: 2,
          kind: eventTypes.yellow,
          relation_id: null,
        },
      ]);
    });
  });

  describe('Formation Change Event List Activity', () => {
    const mockInfieldTeam = {
      '4_5': { id: 5 },
      '7_2': { id: 8 },
    };

    const mockCoordinates = {
      '4_5': {
        id: 10,
        x: 4,
        y: 5,
        position: {
          id: 2,
        },
      },
      '7_2': {
        id: 12,
        x: 7,
        y: 2,
        position: {
          id: 5,
        },
      },
    };

    it('generateNewFormationPlayerActivities generates the respective position activities based on the team info passed in', () => {
      expect(
        generateNewFormationPlayerActivities({
          inFieldTeam: mockInfieldTeam,
          updatedCoordinates: mockCoordinates,
          minuteOfFormation: 10,
          currentPeriod: { absolute_duration_start: 0 },
        })
      ).toEqual([
        {
          absolute_minute: 10,
          athlete_id: 5,
          minute: 10,
          kind: eventTypes.position_change,
          relation: { id: 2 },
        },
        {
          absolute_minute: 10,
          athlete_id: 5,
          minute: 10,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 10 },
        },
        {
          absolute_minute: 10,
          athlete_id: 8,
          minute: 10,
          kind: eventTypes.position_change,
          relation: { id: 5 },
        },
        {
          absolute_minute: 10,
          athlete_id: 8,
          minute: 10,
          kind: eventTypes.formation_position_view_change,
          relation: { id: 12 },
        },
      ]);
    });

    describe('updateFormationPlayerActivities', () => {
      const mockUpdateInfieldTeam = {
        '4_5': { id: 5 },
      };
      const mockUpdateCoordinates = {
        '4_5': {
          id: 10,
          x: 4,
          y: 5,
          position: {
            id: 2,
          },
        },
      };
      const mockFormationActivities = [
        {
          kind: eventTypes.position_change,
          absolute_minute: 4,
          athlete_id: 5,
          game_activity_id: 5,
          relation: { id: 4 },
        },
        {
          kind: eventTypes.formation_position_view_change,
          absolute_minute: 4,
          athlete_id: 5,
          game_activity_id: 5,
          relation: { id: 6 },
        },
      ];

      it('updates the respective formation nested activities when it is a local activity', () => {
        const mockActivity = {
          kind: eventTypes.formation_change,
          absolute_minute: 4,
          relation: { id: 2 },
          game_activities: mockFormationActivities,
        };
        expect(
          updateFormationPlayerActivities({
            gameActivities: [mockActivity],
            currentActivity: mockActivity,
            inFieldTeam: mockUpdateInfieldTeam,
            updatedCoordinates: mockUpdateCoordinates,
            eventIndex: 0,
            foundNewFormation: {
              id: 8,
              name: '3-3-2',
            },
            currentPeriod: { absolute_duration_start: 0 },
          })
        ).toEqual([
          {
            absolute_minute: 4,
            game_activities: [
              {
                absolute_minute: 4,
                athlete_id: 5,
                kind: eventTypes.position_change,
                relation: { id: 2 },
                minute: 4,
              },
              {
                absolute_minute: 4,
                athlete_id: 5,
                kind: eventTypes.formation_position_view_change,
                relation: { id: 10 },
                minute: 4,
              },
            ],
            kind: eventTypes.formation_change,
            relation: { id: 8, name: '3-3-2' },
          },
        ]);
      });

      it('updates the respective formations linked activities when it is a saved activity', () => {
        const mockActivity = {
          kind: eventTypes.formation_change,
          absolute_minute: 4,
          relation: { id: 2 },
          id: 5,
        };
        expect(
          updateFormationPlayerActivities({
            gameActivities: [...mockFormationActivities, mockActivity],
            currentActivity: mockActivity,
            inFieldTeam: mockUpdateInfieldTeam,
            updatedCoordinates: mockUpdateCoordinates,
            eventIndex: 2,
            foundNewFormation: { id: 8, name: '3-3-2' },
            currentPeriod: { absolute_duration_start: 0 },
          })
        ).toEqual([
          {
            absolute_minute: 4,
            athlete_id: 5,
            game_activity_id: 5,
            kind: eventTypes.position_change,
            relation: { id: 2 },
          },
          {
            absolute_minute: 4,
            athlete_id: 5,
            game_activity_id: 5,
            kind: eventTypes.formation_position_view_change,
            relation: { id: 10 },
          },
          {
            absolute_minute: 4,
            id: 5,
            kind: eventTypes.formation_change,
            relation: { id: 8, name: '3-3-2' },
          },
        ]);
      });
    });

    it('handleTeamUpdatedFormationAssignments generates the new inField positions based on the position activities supplied', async () => {
      jest.spyOn(axios, 'get').mockImplementation(() => ({
        data: [
          {
            id: 10,
            x: 4,
            y: 5,
            position: {
              id: 2,
            },
          },
          {
            id: 12,
            x: 7,
            y: 2,
            position: {
              id: 5,
            },
          },
        ],
      }));

      expect(
        await handleTeamUpdatedFormationAssignments(
          1,
          {
            inFieldPlayers: mockInfieldTeam,
            players: [],
          },
          { relation: { id: 4 } },
          [
            {
              kind: eventTypes.formation_position_view_change,
              absolute_minute: 4,
              relation: { id: 10 },
              athlete_id: 5,
            },
            {
              kind: eventTypes.formation_position_view_change,
              absolute_minute: 4,
              relation: { id: 12 },
              athlete_id: 8,
            },
            {
              kind: eventTypes.formation_position_view_change,
              absolute_minute: 4,
              relation: { id: 10 },
              athlete_id: 5,
            },
            {
              kind: eventTypes.formation_position_view_change,
              absolute_minute: 4,
              relation: { id: 12 },
              athlete_id: 25,
            },
          ]
        )
      ).toEqual({
        updatedCoordinates: {
          '4_5': { id: 10, position: { id: 2 }, x: 4, y: 5 },
          '7_2': { id: 12, position: { id: 5 }, x: 7, y: 2 },
        },
        updatedTeam: {
          inFieldPlayers: { '4_5': { id: 5 }, '7_2': { id: 8 } },
          players: [],
        },
      });
      jest.resetAllMocks();
    });
  });

  describe('createFormationCompleteActivity', () => {
    const mockActivities = [
      {
        kind: eventTypes.formation_change,
        absolute_minute: 0,
      },
      {
        kind: eventTypes.formation_position_view_change,
        absolute_minute: 0,
        athlete_id: 4,
      },
    ];

    const currentPeriod = { absolute_duration_start: 0 };

    it('if the formation complete activity doesnt exist it creates a new one', () => {
      expect(
        createFormationCompleteActivity({
          gameActivities: mockActivities,
          currentPeriod,
        })
      ).toEqual([
        ...mockActivities,
        {
          absolute_minute: 0,
          kind: eventTypes.formation_complete,
          minute: 0,
          relation: { id: undefined },
        },
      ]);
    });

    it('if the formation complete activity does exist but it was locally deleted it restores it', () => {
      expect(
        createFormationCompleteActivity({
          gameActivities: [
            ...mockActivities,
            {
              kind: eventTypes.formation_complete,
              absolute_minute: 0,
              delete: true,
            },
          ],
          currentPeriod,
        })
      ).toEqual([
        ...mockActivities,
        {
          kind: eventTypes.formation_complete,
          absolute_minute: 0,
          delete: false,
        },
      ]);
    });
  });

  describe('removeFormationComplete', () => {
    it('returns the activities with the respective formation deleted', () => {
      const mockGameActivities = [
        { id: 1, absolute_minute: 0, kind: eventTypes.formation_complete },
        { id: 2, absolute_minute: 45, kind: eventTypes.formation_complete },
      ];
      expect(
        removeFormationComplete(mockGameActivities, {
          absolute_duration_start: 0,
          absolute_duration_end: 45,
        })
      ).toEqual([
        { ...mockGameActivities[0], delete: true },
        mockGameActivities[1],
      ]);
    });
  });

  describe('doesOwnGoalExistForEvent', () => {
    it('returns `true` if the event has a nested own goal in its `game_activities` array', () => {
      const mockNestedGameActivities = [
        {
          kind: eventTypes.own_goal,
          absolute_minute: 0,
          additional_minute: null,
          relation_id: null,
          minute: 0,
          organisation_id: 1267,
          athlete_id: 96724,
        },
      ];
      const mockGoalActivities = [
        {
          id: 5276308,
          kind: 'goal',
          athlete_id: 96724,
          user_id: null,
          minute: 0,
          additional_minute: null,
          absolute_minute: 0,
          relation_type: 'Athlete',
          relation: null,
          game_period_id: 24,
          game_activity_id: null,
          organisation_id: 1267,
          game_activities: mockNestedGameActivities,
        },
      ];
      const mockEvent = {
        ...mockGoalActivities[0],
        activityIndex: 0,
      };

      expect(doesOwnGoalExistForEvent(mockGoalActivities, mockEvent)).toBe(
        true
      );
    });

    it('returns `true` if there is a linked own goal in the activities list that is connected to the given event and is not deleted', () => {
      const mockId = 77;
      const mockLinkedGameActivities = [
        {
          id: mockId,
          kind: eventTypes.goal,
          athlete_id: 3,
          user_id: null,
          minute: 0,
          additional_minute: null,
          absolute_minute: 0,
          relation_type: 'Athlete',
          relation: null,
          game_period_id: 24,
          game_activity_id: null,
          organisation_id: 123,
        },
        {
          id: 88,
          kind: eventTypes.own_goal,
          athlete_id: 3,
          user_id: null,
          minute: 0,
          additional_minute: null,
          absolute_minute: 0,
          relation_type: null,
          relation: null,
          game_period_id: 24,
          game_activity_id: mockId,
          organisation_id: 123,
        },
      ];
      // Mocked event linked to the own goal
      const mockEvent = {
        id: mockId,
        kind: eventTypes.goal,
        athlete_id: 3,
        user_id: null,
        minute: 0,
        additional_minute: null,
        absolute_minute: 0,
        relation_type: 'Athlete',
        relation: null,
        game_period_id: 24,
        game_activity_id: null,
        organisation_id: 123,
        activityIndex: 0,
      };

      expect(
        doesOwnGoalExistForEvent(mockLinkedGameActivities, mockEvent)
      ).toBe(true);
    });

    it('returns `false` if the event has no nested `game_activities` of kind `own_goal` and there is no linked own goal activity associated with it', () => {
      const mockGameActivity = {
        id: 1,
        kind: eventTypes.goal,
        athlete_id: 33,
        minute: 0,
        additional_minute: null,
        absolute_minute: 0,
        relation_type: 'Athlete',
        game_period_id: 24,
        game_activity_id: null,
        organisation_id: 1267,
      };
      const mockEvent = {
        ...mockGameActivity,
        activityIndex: 0,
      };

      expect(doesOwnGoalExistForEvent([mockGameActivity], mockEvent)).toBe(
        false
      );
    });

    it('returns `false` if there is a deleted linked own goal in the activities list that is connected to the given event', () => {
      const mockId = 1;
      const mockGameActivities = [
        {
          id: mockId,
          kind: eventTypes.goal,
          athlete_id: 5,
          user_id: null,
          minute: 0,
          additional_minute: null,
          absolute_minute: 0,
          relation_type: 'Athlete',
          relation: null,
          game_period_id: 24,
          game_activity_id: null,
          organisation_id: 99,
        },
        {
          id: 2,
          kind: eventTypes.own_goal,
          athlete_id: 5,
          user_id: null,
          minute: 0,
          additional_minute: null,
          absolute_minute: 0,
          relation_type: null,
          relation: null,
          game_period_id: 24,
          game_activity_id: mockId,
          organisation_id: 99,
          delete: true,
        },
      ];
      // Mocked event linked to the deleted own goal
      const mockEvent = {
        id: mockId,
        kind: eventTypes.goal,
        athlete_id: 5,
        user_id: null,
        minute: 0,
        additional_minute: null,
        absolute_minute: 0,
        relation_type: 'Athlete',
        relation: null,
        game_period_id: 24,
        game_activity_id: null,
        organisation_id: 99,
        activityIndex: 0,
      };

      expect(doesOwnGoalExistForEvent(mockGameActivities, mockEvent)).toBe(
        false
      );
    });
  });

  describe('updateGameActivitiesForOwnGoal', () => {
    const mockGoalActivities = [
      {
        id: 10,
        kind: eventTypes.goal,
        athlete_id: 1,
        absolute_minute: 0,
        relation_id: 0,
        activityIndex: 0,
        organisation_id: 123,
      },
      {
        id: 11,
        kind: eventTypes.goal,
        athlete_id: 2,
        absolute_minute: 0,
        relation_id: null,
        activityIndex: 1,
        organisation_id: 123,
      },
    ];

    const mockLinkedOwnGoalActivity = {
      id: 12,
      absolute_minute: 0,
      kind: eventTypes.own_goal,
      athlete_id: 1,
      relation_id: null,
      game_activity_id: 10,
      additional_minute: undefined,
      minute: undefined,
      organisation_id: 123,
    };

    const mockGoalActivitiesWithNestedOwnGoal = [
      {
        id: 10,
        athlete_id: 4,
        relation_id: 0,
        kind: eventTypes.goal,
        activityIndex: 0,
        organisation_id: 123,
        absolute_minute: 0,
      },
      {
        id: 11,
        kind: eventTypes.goal,
        athlete_id: 2,
        absolute_minute: 0,
        relation_id: null,
        activityIndex: 1,
        organisation_id: 123,
      },
    ];

    const mockNestedOwnGoalActivity = {
      kind: eventTypes.own_goal,
      athlete_id: 4,
      relation_id: null,
      organisation_id: 123,
      game_activity_id: 10,
      absolute_minute: 0,
    };

    it('returns the updated game activities with the nested own_goal activity when the switch is on', () => {
      expect(
        updateGameActivitiesForOwnGoal({
          gameActivities: mockGoalActivities,
          eventIndex: 0,
          markAsOwnGoal: true,
        })
      ).toEqual([
        {
          ...mockGoalActivities[0],
          game_activities: [
            {
              absolute_minute: 0,
              athlete_id: 1,
              additional_minute: undefined,
              minute: undefined,
              kind: eventTypes.own_goal,
              organisation_id: 123,
              relation_id: null,
            },
          ],
        },
        mockGoalActivities[1],
      ]);
    });

    it('returns the updated activities with the linked own_goal restored when the switch is on', () => {
      expect(
        updateGameActivitiesForOwnGoal({
          gameActivities: [
            mockGoalActivities[0],
            { ...mockLinkedOwnGoalActivity, delete: true },
          ],
          eventIndex: 0,
          markAsOwnGoal: true,
        })
      ).toEqual([mockGoalActivities[0], mockLinkedOwnGoalActivity]);
    });

    it('returns the game activities without the nested own_goal activity when the switch is off', () => {
      expect(
        updateGameActivitiesForOwnGoal({
          gameActivities: [
            {
              ...mockGoalActivitiesWithNestedOwnGoal[0],
              game_activities: [mockNestedOwnGoalActivity],
            },
            mockGoalActivitiesWithNestedOwnGoal[1],
          ],
          eventIndex: 0,
          markAsOwnGoal: false,
        })
      ).toEqual(mockGoalActivitiesWithNestedOwnGoal);
    });

    it('returns the game activities with the linked own_goal activity marked for deletion when the switch is off', () => {
      expect(
        updateGameActivitiesForOwnGoal({
          gameActivities: [mockGoalActivities[0], mockLinkedOwnGoalActivity],
          eventIndex: 0,
          markAsOwnGoal: false,
        })
      ).toEqual([
        mockGoalActivities[0],
        { ...mockLinkedOwnGoalActivity, delete: true },
      ]);
    });
  });
});
