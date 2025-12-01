import { axios } from '@kitman/common/src/utils/services';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import { data as formationCoordinatesChangedResponse } from '@kitman/services/src/mocks/handlers/planningEvent/getFormationPositionsCoordinates';

import {
  getEventTypeText,
  groupFormationsByGameFormat,
  orderPlayersByGroupAndPositionAndId,
  removeInFieldAthletesFromSelectedAthleteIds,
  getClearedTeam,
  getMaxMinForEventActivities,
  renderEventSrc,
  copyEventsToSelectPeriod,
  getPreviousPeriodLineUp,
  showUnsavedDataModal,
  isGameFormatAndFormationSupported,
  getAllPlayers,
  getNewTeam,
  getLineUpFormationCoordinates,
  getPreviousPeriodGameConfig,
  getPreviousPeriodFormationChange,
  getShouldPromptToClearPeriod,
  getGameActivitiesForTotalTime,
  getPlayerJerseyNumber,
  getNextCoords,
  formatFormationsToDropdownOptions,
  updateTeamFromSquadData,
} from '../utils';
import { mockOrderedPlayerData } from './mockTestSquadData';

describe('Game Events Utils', () => {
  describe('renderEventSrc', () => {
    it('returns the respective image src needed based on the event type', () => {
      expect(renderEventSrc('sub')).toEqual('/img/pitch-view/subArrow.png');
      expect(renderEventSrc('yellow_card')).toEqual(
        '/img/pitch-view/yellowCard.png'
      );
      expect(renderEventSrc('red_card')).toEqual('/img/pitch-view/redCard.png');
      expect(renderEventSrc('goal')).toEqual('/img/pitch-view/goal.png');
      expect(renderEventSrc('own_goal')).toEqual('/img/pitch-view/ownGoal.png');
      expect(renderEventSrc('position_swap')).toEqual(
        '/img/pitch-view/switch.png'
      );
    });
  });

  describe('getEventTypeText', () => {
    it('returns the respective text based on the event type passed in', () => {
      expect(getEventTypeText('substitution', (t) => t)).toEqual(
        'Substitution'
      );

      expect(getEventTypeText('position_swap', (t) => t)).toEqual(
        'Position Switch'
      );

      expect(getEventTypeText('formation_change', (t) => t)).toEqual(
        'Formation Change'
      );

      expect(getEventTypeText('goal', (t) => t)).toEqual('');
    });
  });

  describe('groupFormationsByGameFormat', () => {
    it('returns an object formatted the right way', () => {
      expect(
        groupFormationsByGameFormat(
          [
            {
              id: 1,
              name: '11v11',
              number_of_players: 11,
            },
            {
              id: 2,
              name: '5v5',
              number_of_players: 5,
            },
          ],
          [
            {
              id: 1,
              name: '5-4-1',
              number_of_players: 11,
            },
            {
              id: 2,
              name: '2-2',
              number_of_players: 5,
            },
            {
              id: 3,
              name: '4-4-2',
              number_of_players: 11,
            },
          ]
        )
      ).toEqual({
        11: [
          {
            id: 1,
            name: '5-4-1',
            number_of_players: 11,
          },
          {
            id: 3,
            name: '4-4-2',
            number_of_players: 11,
          },
        ],
        5: [
          {
            id: 2,
            name: '2-2',
            number_of_players: 5,
          },
        ],
      });
    });
  });

  describe('formatFormationsToDropdownOptions', () => {
    const formations = [
      { id: 1, name: '4-4-2', number_of_players: 10 },
      { id: 2, name: '4-2-4', number_of_players: 10 },
      { id: 1, name: '4-5-2', number_of_players: 11 },
    ];

    it('returns only the specific format formations', () => {
      expect(
        formatFormationsToDropdownOptions(formations, true, [
          {
            relation: { id: 1 },
            kind: eventTypes.formation_change,
            absolute_minute: 0,
          },
        ])
      ).toEqual([
        { label: '4-4-2', value: 1 },
        { label: '4-2-4', value: 2 },
      ]);
    });

    it('returns only formations and the grouping category', () => {
      expect(formatFormationsToDropdownOptions(formations, false)).toEqual([
        {
          label: '10 A SIDE',
          options: [
            { label: '4-4-2', value: 1 },
            { label: '4-2-4', value: 2 },
          ],
        },
        { label: '11 A SIDE', options: [{ label: '4-5-2', value: 1 }] },
      ]);
    });
  });

  describe('orderPlayersByGroupAndPositionAndId', () => {
    it('formats the players in a ascending order by Id, groupOrder and order property', () => {
      const unorderedPlayers = [
        {
          id: 5,
          name: 'Ted',
          position: { order: 4, position_group: { order: 1 } },
        },
        {
          id: 1,
          name: 'Dave',
          position: { order: 4, position_group: { order: 1 } },
        },
        {
          id: 4,
          name: 'Chet',
          position: { order: 3, position_group: { order: 1 } },
        },
      ];

      expect(orderPlayersByGroupAndPositionAndId(unorderedPlayers)).toEqual([
        {
          id: 1,
          name: 'Dave',
          position: { order: 4, position_group: { order: 1 } },
        },
        {
          id: 4,
          name: 'Chet',
          position: { order: 3, position_group: { order: 1 } },
        },
        {
          id: 5,
          name: 'Ted',
          position: { order: 4, position_group: { order: 1 } },
        },
      ]);
    });
  });

  describe('removeInFieldAthletesFromSelectedAthleteIds', () => {
    it('removes athlete in the field from the selected athlete ids', () => {
      expect(
        removeInFieldAthletesFromSelectedAthleteIds(mockOrderedPlayerData, {
          '1_2': mockOrderedPlayerData[0],
        })
      ).toEqual([mockOrderedPlayerData[1], mockOrderedPlayerData[2]]);

      expect(
        removeInFieldAthletesFromSelectedAthleteIds(mockOrderedPlayerData, {
          '1_2': mockOrderedPlayerData[1],
        })
      ).toEqual([mockOrderedPlayerData[0], mockOrderedPlayerData[2]]);

      expect(
        removeInFieldAthletesFromSelectedAthleteIds(mockOrderedPlayerData, {
          '1_2': mockOrderedPlayerData[2],
        })
      ).toEqual([mockOrderedPlayerData[0], mockOrderedPlayerData[1]]);
    });
  });

  describe('getClearedTeam', () => {
    const mockTeam = {
      inFieldPlayers: {
        '0_5': mockOrderedPlayerData[0],
        '3_7': mockOrderedPlayerData[1],
      },
      players: [mockOrderedPlayerData[2]],
    };

    it('clears the current infield players and returns them all into the player list', () => {
      expect(getClearedTeam(mockTeam)).toEqual({
        inFieldPlayers: {},
        players: mockOrderedPlayerData,
      });
    });
  });

  describe('getMaxMinForEventActivities', () => {
    it('returns the highest absolute minute when called', () => {
      const activities = [
        {
          athlete_id: 1,
          absolute_minute: 10,
          relation: {
            id: 2,
          },
          kind: eventTypes.switch,
          game_activity_id: 1,
        },
        {
          athlete_id: 1,
          absolute_minute: 25,
          relation: {
            id: 2,
          },
          kind: eventTypes.switch,
          game_activity_id: 1,
        },
        {
          athlete_id: 1,
          absolute_minute: 50,
          relation: {
            id: 2,
          },
          kind: eventTypes.yellow,
          game_activity_id: 1,
        },
        {
          athlete_id: 1,
          absolute_minute: 70,
          relation: {
            id: 2,
          },
          delete: true,
          kind: eventTypes.yellow,
          game_activity_id: 1,
        },
      ];
      expect(getMaxMinForEventActivities(activities)).toEqual(25);
      expect(getMaxMinForEventActivities(activities, activities[1])).toEqual(
        10
      );
      expect(getMaxMinForEventActivities(activities, undefined, true)).toEqual(
        50
      );
    });
  });

  describe('getPreviousPeriodLineUp', () => {
    it('returns an empty array if period is null', () => {
      const period = null;
      const result = getPreviousPeriodLineUp({
        gameActivities: [],
        period,
        gamePeriods: [],
      });
      expect(result).toEqual([]);
    });

    it('returns the correct line up for the previous period', () => {
      const period = {
        absolute_duration_start: 40,
        duration: 40,
      };
      const gamePeriods = [
        { absolute_duration_start: 0, duration: 50 },
        period,
      ];

      const mockGameActivities = [
        {
          id: 1,
          kind: eventTypes.formation_change,
          athlete_id: null,
          minute: 0,
          absolute_minute: 0,
          relation_type: 'Planning::Private::Models::Formation',
          relation: {
            id: 4,
            number_of_players: 11,
            name: '5-4-1',
          },
          game_period_id: 1,
          game_activity_id: null,
        },
        {
          athlete_id: 15642,
          absolute_minute: 0,
          relation: {
            id: 34,
          },
          kind: eventTypes.formation_position_view_change,
        },
        {
          athlete_id: 15642,
          absolute_minute: 0,
          relation: {
            id: 84,
          },
          kind: eventTypes.position_change,
        },
        {
          absolute_minute: 0,
          relation: {
            id: 4,
          },
          kind: eventTypes.formation_complete,
        },
        {
          absolute_minute: 40,
          relation: {
            id: 4,
          },
          kind: eventTypes.formation_change,
        },
      ];

      const lineup = getPreviousPeriodLineUp({
        gameActivities: mockGameActivities,
        period,
        gamePeriods,
      });

      expect(lineup).toEqual([
        {
          ...mockGameActivities[0],
          index: 2,
        },
        {
          ...mockGameActivities[1],
          index: 1,
        },
        {
          ...mockGameActivities[2],
          index: 0,
        },
      ]);
    });
  });

  describe('copyEventsToSelectPeriod', () => {
    it('returns an array of parsed events with the given period', () => {
      const mockGameActivities = [
        {
          minute: 10,
          athlete_id: 143,
          kind: eventTypes.position_change,
          relation: {
            id: 98,
          },
        },
      ];
      const result = copyEventsToSelectPeriod(
        {
          absolute_duration_start: 40,
        },
        mockGameActivities
      );

      expect(result).toEqual([
        {
          absolute_minute: 40,
          athlete_id: 143,
          kind: eventTypes.position_change,
          relation: {
            id: 98,
          },
        },
      ]);
    });

    it('returns an empty array if the events array is empty', () => {
      const emptyEvents = [];
      const result = copyEventsToSelectPeriod(
        {
          absolute_duration_start: 40,
        },
        emptyEvents
      );
      expect(result).toEqual([]);
    });
  });

  describe('showUnsavedDataModal', () => {
    it('should show modal and return true when user confirms', async () => {
      const modalShowAsyncMock = jest.fn().mockResolvedValue(true);
      await showUnsavedDataModal(modalShowAsyncMock);
      expect(modalShowAsyncMock).toHaveBeenCalledTimes(1);
      expect(modalShowAsyncMock).toHaveBeenCalledWith({
        title: 'You have unsaved data!',
        content:
          'All previous events added to the selected period will be deleted.',
      });
    });
  });

  describe('isGameFormatAndFormationSupported', () => {
    it('should return true when the template game format and formation are supported', () => {
      const template = {
        gameFormat: { id: 1, name: 'Format A' },
        formation: { id: 10, name: 'Formation X' },
      };
      const gameFormats = [
        { id: 1, name: 'Format A' },
        { id: 2, name: 'Format B' },
      ];
      const formations = [
        { id: 10, name: 'Formation X' },
        { id: 11, name: 'Formation Y' },
      ];
      const onErrorMock = jest.fn();

      const result = isGameFormatAndFormationSupported({
        template,
        gameFormats,
        formations,
        onError: onErrorMock,
      });

      expect(result).toBe(true);
      expect(onErrorMock).not.toHaveBeenCalled();
    });

    it('should return false and call onError when the template game format is not supported', () => {
      const template = {
        gameFormat: { id: 3, name: 'Format C' },
        formation: { id: 10, name: 'Formation X' },
      };
      const gameFormats = [
        { id: 1, name: 'Format A' },
        { id: 2, name: 'Format B' },
      ];
      const formations = [
        { id: 10, name: 'Formation X' },
        { id: 11, name: 'Formation Y' },
      ];
      const onErrorMock = jest.fn();

      const result = isGameFormatAndFormationSupported({
        template,
        gameFormats,
        formations,
        onError: onErrorMock,
      });

      expect(result).toBe(false);
      expect(onErrorMock).toHaveBeenCalled();
    });

    it('should return false and call onError when the template formation is not supported', () => {
      const template = {
        gameFormat: { id: 1, name: 'Format A' },
        formation: { id: 12, name: 'Formation Z' },
      };
      const gameFormats = [
        { id: 1, name: 'Format A' },
        { id: 2, name: 'Format B' },
      ];
      const formations = [
        { id: 10, name: 'Formation X' },
        { id: 11, name: 'Formation Y' },
      ];
      const onErrorMock = jest.fn();

      const result = isGameFormatAndFormationSupported({
        template,
        gameFormats,
        formations,
        onError: onErrorMock,
      });

      expect(result).toBe(false);
      expect(onErrorMock).toHaveBeenCalled();
    });
  });

  describe('getAllPlayers', () => {
    it('combines team.inFieldPlayers and team.players together', () => {
      const inFieldPlayers = {
        1: { id: 1, firstname: 'John', lastname: 'Doe', position: 'forward' },
        2: {
          id: 2,
          firstname: 'Jane',
          lastname: 'Smith',
          position: 'midfielder',
        },
        3: {
          id: 3,
          firstname: 'Alice',
        },
      };
      const players = [
        {
          id: 3,
          firstname: 'Alice',
          lastname: 'Johnson',
          position: 'midfielder',
        },
        { id: 4, firstname: 'Bob', lastname: 'Brown', position: 'defender' },
        { id: 4, firstname: 'Bob', lastname: 'Brown' }, // duplicates are removed
      ];
      const currentTeam = {
        inFieldPlayers,
        players,
      };

      const result = getAllPlayers(currentTeam);

      expect(result).toHaveLength(4);
      expect(result[0].firstname).toBe('John');
      expect(result[1].firstname).toBe('Jane');
      expect(result[2].firstname).toBe('Alice');
      expect(result[3].firstname).toBe('Bob');
    });
  });

  describe('getNewTeam', () => {
    it('should return a new team with in-field players and additional players', () => {
      const inFieldPlayers = {
        1: { id: 1, firstname: 'John', lastname: 'Doe', position: 'forward' },
        2: {
          id: 2,
          firstname: 'Jane',
          lastname: 'Smith',
          position: 'midfielder',
        },
      };
      const players = [
        {
          id: 3,
          firstname: 'Alice',
          lastname: 'Johnson',
          position: 'midfielder',
        },
        { id: 4, firstname: 'Bob', lastname: 'Brown', position: 'defender' },
      ];
      const opts = {
        inFieldPlayers,
        players,
      };

      const result = getNewTeam(opts);

      expect(result.inFieldPlayers).toEqual(inFieldPlayers);
      expect(result.players).toEqual(players);
    });

    it('should return a new team with inFieldPlayers and no additional players', () => {
      const inFieldPlayers = {
        1: { id: 1, firstname: 'John', lastname: 'Doe', position: 'forward' },
        2: {
          id: 2,
          firstname: 'Jane',
          lastname: 'Smith',
          position: 'midfielder',
        },
      };
      const players = [];
      const opts = {
        inFieldPlayers,
        players,
      };

      const result = getNewTeam(opts);

      expect(result.inFieldPlayers).toEqual(inFieldPlayers);
      expect(result.players).toEqual([]);
    });

    it('should return a new team with no inFieldPlayers and additional players', () => {
      const inFieldPlayers = {};
      const players = [
        { id: 1, firstname: 'John', lastname: 'Doe', position: 'forward' },
        { id: 2, firstname: 'Jane', lastname: 'Smith', position: 'midfielder' },
      ];
      const opts = {
        inFieldPlayers,
        players,
      };
      const result = getNewTeam(opts);
      expect(result.inFieldPlayers).toEqual({});
      expect(result.players).toEqual(players);
    });

    it('should return a new team with no inFieldPlayers and no additional players', () => {
      const inFieldPlayers = {};
      const players = [];
      const opts = {
        inFieldPlayers,
        players,
      };
      const result = getNewTeam(opts);
      expect(result.inFieldPlayers).toEqual({});
      expect(result.players).toEqual([]);
    });
  });

  describe('getLineUpFormationCoordinates', () => {
    it('should return formation coordinates in the correct format', async () => {
      const fieldId = 1;
      const formationId = 10;

      const getRequest = jest.spyOn(axios, 'get');

      const result = await getLineUpFormationCoordinates(fieldId, formationId);

      expect(getRequest).toHaveBeenCalledTimes(1);
      expect(getRequest).toHaveBeenCalledWith(
        `/ui/planning_hub/formation_position_views?field_id=${fieldId}&formation_id=${formationId}`
      );
      expect(result).toEqual({
        '1_3': formationCoordinatesChangedResponse[0],
        '2_4': formationCoordinatesChangedResponse[1],
      });
    });

    it('should return an empty object when there are no formation coordinates', async () => {
      const fieldId = 1;
      const formationId = 10;

      const getRequest = jest
        .spyOn(axios, 'get')

        .mockImplementation(() => {
          return { data: [] };
        });

      const result = await getLineUpFormationCoordinates(fieldId, formationId);

      expect(getRequest).toHaveBeenCalledTimes(1);
      expect(getRequest).toHaveBeenCalledWith(
        `/ui/planning_hub/formation_position_views?field_id=${fieldId}&formation_id=${formationId}`
      );
      expect(result).toEqual({});
    });
  });

  describe('getPreviousPeriodGameConfig', () => {
    it('should return the previous period game format and formation', () => {
      const formationChangeActivity = {
        id: 1,
        kind: eventTypes.formation_change,
        relation: {
          id: 1,
          name: '5-4-1',
          number_of_players: 11,
        },
      };
      const previousPeriodEvents = [
        { id: 2, kind: eventTypes.goal },
        formationChangeActivity,
        { id: 3, kind: eventTypes.assist },
      ];
      const gameFormats = [
        { id: 1, name: 'Format A', number_of_players: 11 },
        { id: 2, name: 'Format B', number_of_players: 8 },
        { id: 3, name: 'Format C', number_of_players: 11 },
      ];
      const formations = [{ id: 1, name: '5-4-1', number_of_players: 11 }];

      const result = getPreviousPeriodGameConfig({
        previousPeriodEvents,
        gameFormats,
        formations,
      });

      expect(result).toEqual({
        previousPeriodGameFormat: gameFormats[0], // The game format with number_of_players 11
        previousPeriodFormation: formationChangeActivity.relation, // The formation from the formation_change activity
      });
    });

    it('should return null for previous period game format when there is no matching game format', () => {
      const formationChangeActivity = {
        id: 1,
        kind: eventTypes.formation_change,
        relation: {
          id: 1,
          name: '5-3-1',
          number_of_players: 9,
        },
      };
      const previousPeriodEvents = [
        { id: 2, kind: eventTypes.goal },
        formationChangeActivity, // This is the formation_change activity
        { id: 3, kind: eventTypes.assist },
      ];
      const gameFormats = [
        { id: 1, name: 'Format A', number_of_players: 11 },
        { id: 2, name: 'Format B', number_of_players: 8 },
        { id: 3, name: 'Format C', number_of_players: 10 },
      ];
      const formations = [{ id: 1, name: '5-3-1', number_of_players: 9 }];

      const result = getPreviousPeriodGameConfig({
        previousPeriodEvents,
        gameFormats,
        formations,
      });

      expect(result).toEqual({
        previousPeriodGameFormat: null,
        previousPeriodFormation: formationChangeActivity.relation,
      });
    });

    it('should return null for both previous period game format and formation when there is no formation_change activity', () => {
      const previousPeriodEvents = [
        { id: 2, kind: eventTypes.goal },
        { id: 3, kind: eventTypes.assist },
      ];
      const gameFormats = [
        { id: 1, name: 'Format A', number_of_players: 11 },
        { id: 2, name: 'Format B', number_of_players: 8 },
        { id: 3, name: 'Format C', number_of_players: 10 },
      ];
      const formations = [{ id: 1, name: '5-3-1', number_of_players: 9 }];

      const result = getPreviousPeriodGameConfig({
        previousPeriodEvents,
        gameFormats,
        formations,
      });

      expect(result).toEqual({
        previousPeriodGameFormat: null,
        previousPeriodFormation: null,
      });
    });
  });

  describe('getPreviousPeriodFormationChange', () => {
    it('should return the most recent formation_change activity', () => {
      const events = [
        {
          id: 1,
          kind: eventTypes.goal,
          minute: '10',
          absolute_minute: '10',
          activityIndex: 0,
        },
        {
          id: 2,
          kind: eventTypes.formation_change,
          minute: '20',
          absolute_minute: '20',
          activityIndex: 1,
        },
        {
          id: 3,
          kind: eventTypes.formation_change,
          minute: '23',
          absolute_minute: '23',
          activityIndex: 2,
        },
        {
          id: 4,
          kind: eventTypes.assist,
          minute: '25',
          absolute_minute: '25',
          activityIndex: 3,
        },
      ];

      const result = getPreviousPeriodFormationChange(events);
      expect(result).toEqual(events[2]);
    });

    it('should return undefined when there is no formation_change activity', () => {
      const events = [
        {
          id: 1,
          kind: eventTypes.goal,
          minute: '10',
          absolute_minute: '10',
          activityIndex: 0,
        },
        {
          id: 2,
          kind: eventTypes.assist,
          minute: '15',
          absolute_minute: '15',
          activityIndex: 1,
        },
      ];
      const result = getPreviousPeriodFormationChange(events);
      expect(result).toBeUndefined();
    });

    it('should return undefined when the events array is empty', () => {
      const events = [];
      const result = getPreviousPeriodFormationChange(events);
      expect(result).toBeUndefined();
    });
  });

  describe('getShouldPromptToClearPeriod', () => {
    it('should return true if there are game activities other than formation_change and total_time', () => {
      const gameActivities = [
        { kind: eventTypes.formation_change, absolute_minute: 10 },
        { kind: eventTypes.total_time, absolute_minute: 10 },
        { kind: eventTypes.position_change, absolute_minute: 10 },
      ];
      const periodStart = 10;
      const result = getShouldPromptToClearPeriod({
        gameActivities,
        periodStart,
      });
      expect(result).toBe(true);
    });
    it('should return false if there are no game activities other than formation_change and total_time', () => {
      const gameActivities = [
        { kind: eventTypes.formation_change, absolute_minute: 10 },
        { kind: eventTypes.total_time, absolute_minute: 10 },
      ];
      const periodStart = 10;
      const result = getShouldPromptToClearPeriod({
        gameActivities,
        periodStart,
      });
      expect(result).toBe(false);
    });
  });

  describe('getNextCoords', () => {
    beforeEach(() => {
      jest.spyOn(axios, 'get').mockImplementation(() => {
        return { data: formationCoordinatesChangedResponse };
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });
    it('returns the appropriate coords when called', async () => {
      expect(await getNextCoords(1, 1)).toEqual({
        '1_3': formationCoordinatesChangedResponse[0],
        '2_4': formationCoordinatesChangedResponse[1],
      });
    });
  });

  describe('updateTeamFromSquadData', () => {
    const mockAthleteEvents = [
      { id: 1, athlete: { ...mockOrderedPlayerData[0], squad_number: 10 } },
      { id: 2, athlete: { ...mockOrderedPlayerData[1], squad_number: 35 } },
      { id: 3, athlete: mockOrderedPlayerData[2] },
    ];

    it('updates the current infield team with the respective jersey numbers', () => {
      expect(
        updateTeamFromSquadData({
          athleteEvents: mockAthleteEvents,
          currentTeam: {
            inFieldPlayers: { '1_1': mockOrderedPlayerData[0] },
            players: [mockOrderedPlayerData[1], mockOrderedPlayerData[2]],
          },
        })
      ).toEqual({
        inFieldPlayers: {
          '1_1': {
            ...mockOrderedPlayerData[0],
            squad_number: 10,
          },
        },
        players: [
          {
            ...mockOrderedPlayerData[1],
            squad_number: 35,
          },
          mockOrderedPlayerData[2],
        ],
      });
    });
  });

  describe('getGameActivitiesForTotalTime', () => {
    const athlete = { id: 1 }; // Define your test athlete data
    const gameActivities = [
      {
        id: 49796,
        kind: eventTypes.position_change,
        athlete_id: 10,
        user_id: null,
        minute: 0,
        additional_minute: null,
        absolute_minute: 0,
        relation_type: 'Position',
        relation: {
          id: 92,
          name: 'Central Midfielder',
          order: 10,
        },
        game_period_id: 29,
        game_activity_id: null,
      },
      {
        id: 123,
        kind: eventTypes.position_change,
        athlete_id: 1,
        user_id: null,
        minute: 0,
        additional_minute: null,
        absolute_minute: 0,
        relation_type: 'Position',
        relation: {
          id: 86,
          name: 'Centre Back',
          order: 4,
        },
        game_period_id: 29,
        game_activity_id: null,
      },
      {
        id: 12345,
        kind: eventTypes.red,
        athlete_id: 1,
        user_id: null,
        minute: 28,
        additional_minute: null,
        absolute_minute: 28,
        relation_type: null,
        relation: null,
        game_period_id: 29,
        game_activity_id: null,
      },
    ];

    test('returns an array of game activities for "position_change" and "red_card"', () => {
      const result = getGameActivitiesForTotalTime(athlete, gameActivities);
      const updatedGameActivity = [
        {
          id: 123,
          kind: eventTypes.position_change,
          athlete_id: 1,
          user_id: null,
          minute: 0,
          additional_minute: null,
          absolute_minute: 0,
          relation_type: 'Position',
          relation: { id: 86, name: 'Centre Back', order: 4 },
          game_period_id: 29,
          game_activity_id: null,
        },
        {
          id: 12345,
          kind: eventTypes.red,
          athlete_id: 1,
          user_id: null,
          minute: 28,
          additional_minute: null,
          absolute_minute: 28,
          relation_type: null,
          relation: null,
          game_period_id: 29,
          game_activity_id: null,
        },
      ];

      expect(result).toEqual(updatedGameActivity);
    });

    test('returns an empty array if there are no matching game activities', () => {
      const athleteWithoutActivities = { id: 2 };
      const result = getGameActivitiesForTotalTime(
        athleteWithoutActivities,
        gameActivities
      );

      expect(result).toEqual([]);
    });
  });

  describe('getPlayerJerseyNumber', () => {
    it('returns the correct squad number when given valid input', () => {
      const squadNumbers = { 1: 10, 2: 7, 3: 23 };
      const key = 2;
      const result = getPlayerJerseyNumber(squadNumbers, key);
      expect(result).toEqual(7);
    });

    it('returns undefined when key is not in the squadNumbers object', () => {
      const squadNumbers = { 1: 10, 2: 7, 3: 23 };
      const key = 4;
      const result = getPlayerJerseyNumber(squadNumbers, key);
      expect(result).toBeUndefined();
    });

    it('returns undefined when squadNumbers is null', () => {
      const squadNumbers = null;
      const key = 1;
      const result = getPlayerJerseyNumber(squadNumbers, key);
      expect(result).toBeUndefined();
    });

    it('returns undefined when key is not a number', () => {
      const squadNumbers = { 1: 10, 2: 7, 3: 23 };
      const key = '2';
      const result = getPlayerJerseyNumber(squadNumbers, key);
      expect(result).toBeUndefined();
    });
  });
});
