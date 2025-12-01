import { axios } from '@kitman/common/src/utils/services';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import {
  getCurrentLocalPeriods,
  getPeriodDurationInfo,
  clearPeriodActivities,
  recalculateCustomPeriodExistingActivities,
  recalculatePeriodEventInfo,
  onAddPeriod,
  onDeletePeriod,
  updateAllPeriodGameActivities,
  deleteAndRecalculateCustomPeriods,
  hasStartingPeriodLineupBeenCompleted,
  hasCaptainBeenAssignedInPeriod,
  getHasPeriodStarted,
  isActivityInPeriod,
} from '../gamePeriodUtils';

describe('Game Periods Utils', () => {
  describe('isActivityInPeriod', () => {
    it('returns a boolean whether if the activity period id matches the period id', () => {
      expect(isActivityInPeriod({ id: 1, game_period_id: 2 }, { id: 2 })).toBe(
        true
      );
      expect(isActivityInPeriod({ id: 1, game_period_id: 2 }, { id: 1 })).toBe(
        false
      );
    });

    it('returns a boolean if the activity absolute minute falls within the period start and end', () => {
      expect(
        isActivityInPeriod(
          { id: 1, absolute_minute: 30 },
          { absolute_duration_start: 20, absolute_duration_end: 40 }
        )
      ).toBe(true);
      expect(
        isActivityInPeriod(
          { id: 1, absolute_minute: 20 },
          { absolute_duration_start: 30, absolute_duration_end: 40 }
        )
      ).toBe(false);
    });
  });

  describe('getCurrentLocalPeriods', () => {
    const mockPeriods = [
      { id: 1, delete: false },
      { id: 2, delete: true },
      { id: 3, delete: false },
    ];

    it('filters out the current local periods not marked for deletion', () => {
      const returnedMockPeriods = getCurrentLocalPeriods(mockPeriods);
      expect(returnedMockPeriods.length).toBe(2);
      expect(returnedMockPeriods).toStrictEqual([
        { id: 1, delete: false },
        { id: 3, delete: false },
      ]);
    });
  });

  describe('getPeriodDurationInfo', () => {
    const mockPeriods = [
      { id: 1, duration: 50, name: 'Period 1' },
      { id: 2, duration: 50, name: 'Period 2' },
    ];

    it('returns the appropriate recalculated duration when the duration is passed in', () => {
      expect(getPeriodDurationInfo(mockPeriods, true, 100)).toEqual({
        newNumOfPeriods: 3,
        newPeriodDuration: 33,
        newPeriodFinalDuration: 34,
        newPeriodFinalTime: 100,
      });
    });

    it('returns the appropriate recalculated duration when the duration is not passed in', () => {
      expect(getPeriodDurationInfo(mockPeriods, true)).toEqual({
        newNumOfPeriods: 3,
        newPeriodDuration: 33,
        newPeriodFinalDuration: 34,
        newPeriodFinalTime: 100,
      });
    });

    it('returns the appropriate recalculated duration when it is reducing the amount of periods', () => {
      expect(getPeriodDurationInfo(mockPeriods, false, 100)).toEqual({
        newNumOfPeriods: 1,
        newPeriodDuration: 100,
        newPeriodFinalDuration: 100,
        newPeriodFinalTime: 100,
      });
    });
  });

  describe('clearPeriodActivities', () => {
    const mockGameActivities = [
      { kind: eventTypes.yellow, absolute_minute: 0, athlete_id: 2553 },
      { kind: eventTypes.red, absolute_minute: 0, athlete_id: 2553, id: 1 },
      { kind: eventTypes.formation_complete, id: 2, absolute_minute: 0 },
      {
        kind: eventTypes.formation_change,
        absolute_minute: 0,
        athlete_id: 2553,
        id: 1,
        relation_id: 0,
      },
      {
        kind: eventTypes.goal,
        absolute_minute: 30,
        athlete_id: 2553,
        id: 4,
        relation_id: 0,
      },
      {
        kind: eventTypes.captain_assigned,
        absolute_minute: 0,
        athlete_id: 2553,
      },
    ];

    it('clears and sets up any activities for deletion when called', () => {
      expect(
        clearPeriodActivities({
          gameActivities: mockGameActivities,
          currentPeriod: {
            absolute_duration_start: 0,
            absolute_duration_end: 30,
          },
        })
      ).toEqual([
        {
          ...mockGameActivities[1],
          delete: true,
        },
        { ...mockGameActivities[2], delete: true },
        mockGameActivities[3],
        mockGameActivities[4],
        mockGameActivities[5],
      ]);
    });

    it('clears and sets up any events for deletion when called', () => {
      expect(
        clearPeriodActivities({
          gameActivities: mockGameActivities,
          currentPeriod: {
            absolute_duration_start: 0,
            absolute_duration_end: 30,
          },
          isEventListShown: true,
        })
      ).toEqual([
        {
          absolute_minute: 0,
          athlete_id: 2553,
          delete: true,
          id: 1,
          kind: eventTypes.red,
        },
        mockGameActivities[2],
        mockGameActivities[3],
        mockGameActivities[4],
        mockGameActivities[5],
      ]);
    });

    it('clears all activities within the period marked as well as the ones equal to the last minute of the period', () => {
      expect(
        clearPeriodActivities({
          gameActivities: mockGameActivities,
          currentPeriod: {
            absolute_duration_start: 0,
            absolute_duration_end: 30,
          },
          isLastPeriodSelected: true,
        })
      ).toEqual([
        {
          absolute_minute: 0,
          athlete_id: 2553,
          delete: true,
          id: 1,
          kind: eventTypes.red,
        },
        { ...mockGameActivities[2], delete: true },
        mockGameActivities[3],
        { ...mockGameActivities[4], delete: true },
        mockGameActivities[5],
      ]);
    });
  });

  describe('recalculateCustomPeriodExistingActivities', () => {
    const mockEventPeriods = [
      {
        id: 1,
        duration: 50,
        absolute_duration_start: 0,
        absolute_duration_end: 50,
        name: 'Period 1',
      },
      {
        id: 2,
        duration: 50,
        absolute_duration_start: 50,
        absolute_duration_end: 100,
        name: 'Period 2',
        delete: true,
      },
    ];

    const mockNewCustomEventPeriods = [
      {
        id: 1,
        duration: 30,
        absolute_duration_start: 0,
        absolute_duration_end: 30,
        name: 'Period 1',
      },
      {
        id: 2,
        duration: 60,
        absolute_duration_start: 30,
        absolute_duration_end: 90,
        name: 'Period 2',
      },
    ];

    const mockGameActivities = [
      {
        absolute_minute: 0,
        relation: { id: 4 },
        kind: eventTypes.formation_change,
      },
      {
        absolute_minute: 45,
        athleteId: 4444,
        kind: eventTypes.goal,
      },
      {
        absolute_minute: 50,
        relation: { id: 5 },
        kind: eventTypes.formation_change,
      },
    ];

    it('recalculates the activities based on the new custom period durations assigned', () => {
      expect(
        recalculateCustomPeriodExistingActivities(
          mockEventPeriods,
          mockNewCustomEventPeriods,
          mockGameActivities
        )
      ).toEqual([
        {
          absolute_minute: 0,
          kind: eventTypes.formation_change,
          relation: { id: 4 },
        },
        {
          absolute_minute: 30,
          kind: eventTypes.formation_change,
          relation: { id: 5 },
        },
      ]);
    });
  });

  describe('recalculatePeriodEventInfo', () => {
    const mockEventPeriods = [
      {
        id: 1,
        duration: 50,
        absolute_duration_start: 0,
        absolute_duration_end: 50,
        name: 'Period 1',
      },
      {
        id: 2,
        duration: 50,
        absolute_duration_start: 50,
        absolute_duration_end: 100,
        name: 'Period 2',
        delete: true,
      },
    ];
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

    it('recalculates the periods and events when it is being deleted', () => {
      expect(
        recalculatePeriodEventInfo(
          mockEventPeriods,
          mockGameActivities,
          100,
          100
        )
      ).toEqual({
        recalculatedActivities: [
          {
            absolute_minute: 0,
            kind: eventTypes.formation_change,
            relation: { id: 4 },
          },
        ],
        recalculatedPeriods: [
          {
            absolute_duration_end: 100,
            absolute_duration_start: 0,
            duration: 100,
            id: 1,
            name: 'Period 1',
          },
          {
            absolute_duration_end: 100,
            absolute_duration_start: -1,
            delete: true,
            duration: 100,
            id: 2,
            name: 'DELETE',
          },
        ],
      });
    });

    it('recalculates the periods and events when it is being added', () => {
      expect(
        recalculatePeriodEventInfo(
          [
            mockEventPeriods[0],
            {
              id: 2,
              duration: 50,
              absolute_duration_start: 50,
              absolute_duration_end: 100,
              name: 'Period 2',
            },
          ],
          mockGameActivities,
          100,
          100,
          true
        )
      ).toEqual({
        recalculatedActivities: [
          {
            absolute_minute: 0,
            kind: eventTypes.formation_change,
            relation: { id: 4 },
          },
          {
            absolute_minute: 100,
            kind: eventTypes.formation_change,
            relation: { id: 5 },
          },
        ],
        recalculatedPeriods: [
          {
            absolute_duration_end: 100,
            absolute_duration_start: 0,
            duration: 100,
            id: 1,
            name: 'Period 1',
          },
          {
            absolute_duration_end: 200,
            absolute_duration_start: 100,
            duration: 100,
            id: 2,
            name: 'Period 2',
          },
        ],
      });
    });

    it('recalculates the periods and events, while removing activities that fall out of the periods scope', () => {
      const mockScopePeriods = [
        {
          id: 1,
          duration: 50,
          absolute_duration_start: 0,
          absolute_duration_end: 50,
          name: 'Period 1',
        },
        {
          id: 2,
          duration: 50,
          absolute_duration_start: 50,
          absolute_duration_end: 100,
          name: 'Period 2',
        },
        {
          id: 2,
          duration: 50,
          absolute_duration_start: 100,
          absolute_duration_end: 150,
          name: 'Period 3',
          delete: true,
        },
      ];

      const mockScopeActivities = [
        {
          absolute_minute: 50,
          relation: { id: 5 },
          kind: eventTypes.formation_change,
        },
        {
          id: 1,
          absolute_minute: 60,
          relation: { id: 5 },
          kind: eventTypes.formation_change,
        },
        {
          absolute_minute: 68,
          athlete_id: 2458,
          relation_id: null,
          kind: eventTypes.red,
        },
      ];

      expect(
        recalculatePeriodEventInfo(
          mockScopePeriods,
          mockScopeActivities,
          75,
          75
        )
      ).toEqual({
        recalculatedActivities: [
          {
            absolute_minute: 75,
            kind: eventTypes.formation_change,
            relation: { id: 5 },
          },
          {
            absolute_minute: 60,
            delete: true,
            id: 1,
            kind: eventTypes.formation_change,
            relation: { id: 5 },
          },
        ],
        recalculatedPeriods: [
          {
            absolute_duration_end: 75,
            absolute_duration_start: 0,
            duration: 75,
            id: 1,
            name: 'Period 1',
          },
          {
            absolute_duration_end: 150,
            absolute_duration_start: 75,
            duration: 75,
            id: 2,
            name: 'Period 2',
          },
          {
            absolute_duration_end: 150,
            absolute_duration_start: -1,
            delete: true,
            duration: 75,
            id: 2,
            name: 'DELETE',
          },
        ],
      });
    });
  });

  describe('onAddPeriod', () => {
    const mockEventPeriods = [
      {
        id: 1,
        duration: 50,
        absolute_duration_start: 0,
        absolute_duration_end: 50,
        name: 'Period 1',
      },
      {
        id: 2,
        duration: 50,
        absolute_duration_start: 50,
        absolute_duration_end: 100,
        name: 'Period 2',
      },
    ];
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

    const mockSetSelectedPeriod = jest.fn();

    it('adds on another period and recalculates the durations', () => {
      const result = onAddPeriod(
        mockEventPeriods,
        mockGameActivities,
        100,
        mockEventPeriods[0],
        mockSetSelectedPeriod
      );
      expect(mockSetSelectedPeriod).toHaveBeenCalledWith({
        absolute_duration_end: 33,
        absolute_duration_start: 0,
        duration: 33,
        id: 1,
        name: 'Period 1',
      });
      expect(result).toEqual({
        recalculatedActivities: [
          {
            absolute_minute: 0,
            kind: eventTypes.formation_change,
            relation: { id: 4 },
          },
          {
            absolute_minute: 33,
            kind: eventTypes.formation_change,
            relation: { id: 5 },
          },
        ],
        recalculatedPeriods: [
          {
            absolute_duration_end: 33,
            absolute_duration_start: 0,
            duration: 33,
            id: 1,
            name: 'Period 1',
          },
          {
            absolute_duration_end: 66,
            absolute_duration_start: 33,
            duration: 33,
            id: 2,
            name: 'Period 2',
          },
          {
            absolute_duration_end: 100,
            absolute_duration_start: 66,
            duration: 34,
            localId: 3,
            name: 'Period 3',
          },
        ],
      });
    });

    it('adds on another period after there is already a new existing localId', () => {
      const existingMockEventPeriods = [
        ...mockEventPeriods,
        {
          absolute_duration_end: 100,
          absolute_duration_start: 66,
          duration: 33,
          localId: 3,
          name: 'Period 3',
        },
      ];

      const result = onAddPeriod(
        existingMockEventPeriods,
        mockGameActivities,
        100
      );

      expect(result).toEqual({
        recalculatedActivities: [
          {
            absolute_minute: 0,
            kind: eventTypes.formation_change,
            relation: { id: 4 },
          },
          {
            absolute_minute: 25,
            kind: eventTypes.formation_change,
            relation: { id: 5 },
          },
        ],
        recalculatedPeriods: [
          {
            absolute_duration_end: 25,
            absolute_duration_start: 0,
            duration: 25,
            id: 1,
            name: 'Period 1',
          },
          {
            absolute_duration_end: 50,
            absolute_duration_start: 25,
            duration: 25,
            id: 2,
            name: 'Period 2',
          },
          {
            absolute_duration_end: 75,
            absolute_duration_start: 50,
            duration: 25,
            localId: 3,
            name: 'Period 3',
          },
          {
            absolute_duration_end: 100,
            absolute_duration_start: 75,
            duration: 25,
            localId: 4,
            name: 'Period 4',
          },
        ],
      });
    });
  });
  describe('onDeletePeriod', () => {
    const mockEventPeriods = [
      {
        id: 1,
        duration: 50,
        absolute_duration_start: 0,
        absolute_duration_end: 50,
        name: 'Period 1',
      },
      {
        id: 2,
        duration: 50,
        absolute_duration_start: 50,
        absolute_duration_end: 100,
        name: 'Period 2',
      },
      {
        localId: 3,
        duration: 50,
        absolute_duration_start: 100,
        absolute_duration_end: 150,
        name: 'Period 3',
      },
    ];

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
      {
        absolute_minute: 100,
        relation: { id: 5 },
        kind: eventTypes.formation_change,
      },
    ];

    const mockSetSelectedPeriod = jest.fn();

    it('marks the first period for deletion when onDeletePeriod is called', () => {
      const result = onDeletePeriod(
        mockEventPeriods[0],
        mockEventPeriods,
        mockGameActivities,
        150,
        mockEventPeriods[0],
        mockSetSelectedPeriod
      );
      expect(mockSetSelectedPeriod).toHaveBeenCalledWith({
        absolute_duration_end: 75,
        absolute_duration_start: 0,
        duration: 75,
        id: 2,
        name: 'Period 1',
      });
      expect(result).toEqual({
        recalculatedActivities: [
          {
            absolute_minute: 0,
            kind: eventTypes.formation_change,
            relation: { id: 5 },
          },
          {
            absolute_minute: 75,
            kind: eventTypes.formation_change,
            relation: { id: 5 },
          },
        ],
        recalculatedPeriods: [
          {
            absolute_duration_end: 0,
            absolute_duration_start: -1,
            delete: true,
            duration: 75,
            id: 1,
            name: 'DELETE',
          },
          {
            absolute_duration_end: 75,
            absolute_duration_start: 0,
            duration: 75,
            id: 2,
            name: 'Period 1',
          },
          {
            absolute_duration_end: 150,
            absolute_duration_start: 75,
            duration: 75,
            localId: 3,
            name: 'Period 2',
          },
        ],
      });
    });

    it('marks the last period for deletion when onDeletePeriod is called and sets the middle period as the selected', () => {
      const result = onDeletePeriod(
        mockEventPeriods[2],
        mockEventPeriods,
        mockGameActivities,
        150,
        mockEventPeriods[2],
        mockSetSelectedPeriod
      );
      expect(mockSetSelectedPeriod).toHaveBeenCalledWith({
        absolute_duration_end: 150,
        absolute_duration_start: 75,
        duration: 75,
        id: 2,
        name: 'Period 2',
      });
      expect(result).toEqual({
        recalculatedActivities: [
          {
            absolute_minute: 0,
            kind: eventTypes.formation_change,
            relation: { id: 4 },
          },
          {
            absolute_minute: 75,
            kind: eventTypes.formation_change,
            relation: { id: 5 },
          },
        ],
        recalculatedPeriods: [
          {
            absolute_duration_end: 75,
            absolute_duration_start: 0,
            duration: 75,
            id: 1,
            name: 'Period 1',
          },
          {
            absolute_duration_end: 150,
            absolute_duration_start: 75,
            duration: 75,
            id: 2,
            name: 'Period 2',
          },
        ],
      });
    });
  });

  describe('updateAllPeriodGameActivities', () => {
    const response = [
      { id: 1, absolute_min: 0, relation: { id: 4 }, kind: 'formation_change' },
    ];

    const testPeriods = [
      { id: 1, absolute_duration_end: 20, absolute_duration_start: 0 },
      { id: 2, absolute_duration_end: 40, absolute_duration_start: 20 },
    ];

    const testActivities = [
      {
        absolute_minute: 0,
        relation: { id: 4 },
        kind: eventTypes.formation_change,
      },
      { absolute_minute: 20, kind: eventTypes.goal },
      {
        absolute_minute: 30,
        relation: { id: 5 },
        kind: eventTypes.formation_change,
      },
    ];

    beforeEach(() => {
      jest
        .spyOn(axios, 'post')

        .mockImplementation(() => {
          return { data: response };
        });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('calls a save request for every period that has an activity that needs saving', async () => {
      const result = await updateAllPeriodGameActivities({
        gamePeriods: testPeriods,
        apiGameActivities: [],
        localGameActivities: testActivities,
        gameId: 1,
      });
      expect(axios.post).toHaveBeenCalledWith(
        '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
        {
          game_activities: [
            {
              absolute_minute: 0,
              kind: eventTypes.formation_change,
              relation: { id: 4 },
            },
          ],
        }
      );
      expect(axios.post).toHaveBeenCalledWith(
        '/ui/planning_hub/events/1/game_periods/2/v2/game_activities/bulk_save',
        {
          game_activities: [
            { absolute_minute: 20, kind: eventTypes.goal },
            {
              absolute_minute: 30,
              kind: eventTypes.formation_change,
              relation: { id: 5 },
            },
          ],
        }
      );
      expect(result).toEqual([
        response,
        [
          {
            absolute_min: 0,
            id: 1,
            kind: 'formation_change',
            relation: {
              id: 4,
            },
          },
        ],
      ]);
    });

    it('only does a save request for the currently selected period when the  onlySelectedPeriod prop is passed in', async () => {
      const result = await updateAllPeriodGameActivities({
        gamePeriods: testPeriods,
        apiGameActivities: [],
        localGameActivities: testActivities,
        gameId: 1,
        onlySelectedPeriod: testPeriods[0],
      });
      expect(axios.post).toHaveBeenCalledWith(
        '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
        {
          game_activities: [
            {
              absolute_minute: 0,
              kind: eventTypes.formation_change,
              relation: { id: 4 },
            },
          ],
        }
      );

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        response,
        [
          { absolute_minute: 20, kind: 'goal' },
          {
            absolute_minute: 30,
            kind: 'formation_change',
            relation: { id: 5 },
          },
        ],
      ]);
    });

    it('allows periods to save activities that are less than or equal to the absolute_duration_end of the only period', async () => {
      await updateAllPeriodGameActivities({
        gamePeriods: [testPeriods[0]],
        apiGameActivities: [],
        localGameActivities: [
          testActivities[0],
          testActivities[1],
          { absolute_minute: 15, kind: eventTypes.goal },
          { absolute_minute: 35, kind: eventTypes.goal },
        ],
        gameId: 1,
      });
      expect(axios.post).toHaveBeenCalledWith(
        '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
        {
          game_activities: [
            testActivities[0],
            testActivities[1],
            { absolute_minute: 15, kind: eventTypes.goal },
          ],
        }
      );
    });

    it('allows periods to save activities as well as those that are less than or equal to the absolute_duration_end of the last period', async () => {
      await updateAllPeriodGameActivities({
        gamePeriods: testPeriods,
        apiGameActivities: [],
        localGameActivities: [
          ...testActivities,
          { absolute_minute: 40, kind: eventTypes.goal, athlete_id: 1444 },
        ],
        gameId: 1,
      });
      expect(axios.post).toHaveBeenCalledWith(
        '/ui/planning_hub/events/1/game_periods/1/v2/game_activities/bulk_save',
        {
          game_activities: [testActivities[0]],
        }
      );
      expect(axios.post).toHaveBeenCalledWith(
        '/ui/planning_hub/events/1/game_periods/2/v2/game_activities/bulk_save',
        {
          game_activities: [
            testActivities[1],
            testActivities[2],
            { absolute_minute: 40, athlete_id: 1444, kind: eventTypes.goal },
          ],
        }
      );
    });
  });

  describe('deleteAndRecalculateCustomPeriods', () => {
    const mockEventPeriods = [
      {
        id: 1,
        duration: 50,
        absolute_duration_start: 0,
        absolute_duration_end: 50,
        name: 'Period 1',
      },
      {
        id: 2,
        duration: 50,
        absolute_duration_start: 40,
        absolute_duration_end: 90,
        name: 'Period 2',
      },
      {
        id: 3,
        duration: 60,
        absolute_duration_start: 90,
        absolute_duration_end: 150,
        name: 'Period 3',
      },
      {
        id: 4,
        duration: 60,
        delete: true,
        absolute_duration_start: 90,
        absolute_duration_end: 150,
        name: 'DELETE',
      },
    ];

    const mockActivities = [
      { kind: eventTypes.formation_change, absolute_minute: 10 },
      { kind: eventTypes.formation_change, absolute_minute: 55 },
      { kind: eventTypes.formation_change, absolute_minute: 100 },
    ];

    it('recalculates and returns the new total duration and periods', () => {
      expect(
        deleteAndRecalculateCustomPeriods(
          mockEventPeriods[1],
          mockEventPeriods,
          mockActivities
        )
      ).toEqual({
        currentActivities: [
          { absolute_minute: 10, kind: eventTypes.formation_change },
          { absolute_minute: 100, kind: eventTypes.formation_change },
        ],
        currentPeriods: [
          {
            absolute_duration_end: 50,
            absolute_duration_start: 0,
            duration: 50,
            id: 1,
            name: 'Period 1',
          },
          {
            absolute_duration_end: 110,
            absolute_duration_start: 50,
            duration: 60,
            id: 3,
            name: 'Period 2',
          },
          {
            absolute_duration_end: 150,
            absolute_duration_start: 90,
            delete: true,
            duration: 60,
            id: 4,
            name: 'DELETE',
          },
          {
            absolute_duration_end: 90,
            absolute_duration_start: 40,
            delete: true,
            duration: 50,
            id: 2,
            name: 'DELETE',
          },
        ],
        periodDurationSum: 110,
      });
    });
  });

  describe('hasStartingPeriodLineupBeenCompleted', () => {
    const mockActivities = [
      {
        kind: eventTypes.formation_change,
        absolute_minute: 0,
        relation: { id: 4, number_of_players: 2 },
      },
      {
        kind: eventTypes.formation_position_view_change,
        absolute_minute: 0,
        athlete_id: 4,
      },
    ];

    const currentPeriod = { absolute_duration_start: 0 };

    it('returns a boolean based on if the number of formation_position_view_changes equals the number of players for the formation', () => {
      expect(
        hasStartingPeriodLineupBeenCompleted(mockActivities, currentPeriod)
      ).toEqual(false);

      expect(
        hasStartingPeriodLineupBeenCompleted(
          [...mockActivities, mockActivities[1]],
          currentPeriod
        )
      ).toEqual(true);
    });
  });

  describe('hasCaptainBeenAssignedInPeriod', () => {
    const mockActivities = [
      {
        kind: eventTypes.captain_assigned,
        absolute_minute: 0,
        athlete_id: 4,
      },
      {
        kind: eventTypes.formation_position_view_change,
        absolute_minute: 0,
        athlete_id: 4,
      },
    ];

    const currentPeriod = { absolute_duration_start: 0 };

    it('returns a boolean based on if the assigned captain has a pitch activity', () => {
      expect(
        hasCaptainBeenAssignedInPeriod(
          [mockActivities[0], { ...mockActivities[1], athlete_id: 5 }],
          currentPeriod
        )
      ).toEqual(false);

      expect(
        hasCaptainBeenAssignedInPeriod(
          [...mockActivities, mockActivities[1]],
          currentPeriod
        )
      ).toEqual(true);
    });
  });

  describe('getHasPeriodStarted', () => {
    it('returns true when the period has started', () => {
      const hasPeriodStarted = getHasPeriodStarted(
        [
          {
            kind: eventTypes.formation_complete,
            minute: 12,
            absolute_minute: 12,
          },
        ],
        {
          id: 1,
          name: 'period 1',
          duration: 25,
          order: 1,
          absolute_duration_start: 12,
        }
      );
      expect(hasPeriodStarted).toBeTruthy();
    });

    it('returns false when the period has not started', () => {
      const hasPeriodStarted = getHasPeriodStarted(
        [
          {
            kind: eventTypes.formation_position_view_change,
            minute: 12,
            absolute_minute: 12,
          },
        ],
        {
          id: 1,
          name: 'period 1',
          duration: 25,
          order: 1,
          absolute_duration_start: 12,
        }
      );
      expect(hasPeriodStarted).toBeFalsy();
    });
  });
});
