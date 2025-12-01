import { data as reasonsData } from '@kitman/services/src/mocks/handlers/leaguefixtures/getDisciplinaryReasonsHandler';
import { eventTypes } from '@kitman/common/src/consts/gameEventConsts';
import _isEqual from 'lodash/isEqual';
import {
  handleEventButtonSelection,
  updateMatchReportEventSwapActivities,
  updatePitchEventSwapActivities,
  preparePenaltyReasonsOptions,
  checkIfYellowCardTimeIsValid,
} from '../eventListUtils';

jest.mock('lodash/isEqual', () => jest.fn((a, b) => a === b));
describe('eventListUtils', () => {
  describe('handleEventButtonSelection', () => {
    const mockSetActiveEventSelection = jest.fn();
    it('sets the event type when there is no current one selected', () => {
      handleEventButtonSelection({
        activeEventSelection: '',
        setActiveEventSelection: mockSetActiveEventSelection,
        eventType: eventTypes.red,
      });
      expect(mockSetActiveEventSelection).toHaveBeenCalledWith(eventTypes.red);
    });

    it('unsets the event type when there it is the one selected', () => {
      handleEventButtonSelection({
        activeEventSelection: eventTypes.red,
        setActiveEventSelection: mockSetActiveEventSelection,
        eventType: eventTypes.red,
      });
      expect(mockSetActiveEventSelection).toHaveBeenCalledWith('');
    });
    it('calls dispatchMandatoryFieldsToast when preventEvent is true', () => {
      const dispatchMandatoryFieldsToast = jest.fn();

      handleEventButtonSelection({
        activeEventSelection: eventTypes.goal,
        setActiveEventSelection: mockSetActiveEventSelection,
        eventType: eventTypes.goal,
        preventEvent: true,
        dispatchMandatoryFieldsToast,
      });

      expect(dispatchMandatoryFieldsToast).toHaveBeenCalled();
    });
  });

  describe('updateMatchReportEventSwapActivities', () => {
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
    ];

    const mockFlatActivities = [
      {
        id: 1,
        athlete_id: 1,
        absolute_minute: 0,
        relation: {
          id: 2,
        },
        kind: eventTypes.sub,
        game_activity_id: 1,
      },
      ...mockActivities,
    ];

    const mockNestedActivities = [
      {
        athlete_id: 1,
        absolute_minute: 0,
        relation: {
          id: 2,
        },
        kind: eventTypes.sub,
        game_activities: mockActivities,
      },
    ];

    it('(game_activity_id ver) updates the activities returns the new list with updateMatchReportEventSwapActivities when a new athlete is chosen', () => {
      expect(
        updateMatchReportEventSwapActivities({
          gameActivities: mockFlatActivities,
          currentActivity: mockFlatActivities[0],
          swappedAthlete: { id: 3, position: { id: 10 } },
          eventIndex: 0,
        })
      ).toEqual([
        {
          absolute_minute: 0,
          athlete_id: 1,
          game_activity_id: 1,
          id: 1,
          kind: eventTypes.sub,
          relation: { id: 3 },
        },
        {
          absolute_minute: 0,
          athlete_id: 1,
          game_activity_id: 1,
          kind: eventTypes.position_change,
          relation: { id: 10 },
        },
        {
          absolute_minute: 0,
          athlete_id: 3,
          game_activity_id: 1,
          kind: eventTypes.position_change,
          relation: { id: 5 },
        },
      ]);
    });

    it('(game_activities ver) updates the activities returns the new list with updateMatchReportEventSwapActivities when a new athlete is chosen', () => {
      expect(
        updateMatchReportEventSwapActivities({
          gameActivities: mockNestedActivities,
          currentActivity: mockNestedActivities[0],
          swappedAthlete: { id: 3, position: { id: 10 } },
          eventIndex: 0,
        })
      ).toEqual([
        {
          absolute_minute: 0,
          athlete_id: 1,
          game_activities: [
            {
              absolute_minute: 0,
              athlete_id: 1,
              game_activity_id: 1,
              kind: eventTypes.position_change,
              relation: { id: 10 },
            },
            {
              absolute_minute: 0,
              athlete_id: 3,
              game_activity_id: 1,
              kind: eventTypes.position_change,
              relation: { id: 5 },
            },
          ],
          kind: eventTypes.sub,
          relation: { id: 3 },
        },
      ]);
    });
  });

  describe('updatePitchEventSwapActivities', () => {
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

    const mockNestedActivities = [
      {
        athlete_id: 1,
        absolute_minute: 0,
        relation: {
          id: 2,
        },
        kind: eventTypes.switch,
        game_activities: mockActivities,
      },
    ];

    it('(game_activity_id ver) updates the activities returns the new list with updatePitchEventSwapActivities when a new athlete is chosen', () => {
      expect(
        updatePitchEventSwapActivities({
          gameActivities: mockFlatActivities,
          currentActivity: mockFlatActivities[0],
          positionData: { id: 6, position: { id: 6 } },
          athleteId: 3,
          eventIndex: 0,
        })
      ).toEqual({
        updatedFormationPositionChangeIndex: 4,
        updatedGameActivities: [
          {
            absolute_minute: 0,
            athlete_id: 1,
            game_activity_id: 1,
            id: 1,
            kind: eventTypes.switch,
            relation: { id: 3 },
          },
          {
            absolute_minute: 0,
            athlete_id: 1,
            game_activity_id: 1,
            kind: eventTypes.position_change,
            relation: { id: 6 },
          },
          {
            absolute_minute: 0,
            athlete_id: 3,
            game_activity_id: 1,
            kind: eventTypes.position_change,
            relation: { id: 5 },
          },
          {
            absolute_minute: 0,
            athlete_id: 1,
            game_activity_id: 1,
            kind: eventTypes.formation_position_view_change,
            relation: { id: 6 },
          },
          {
            absolute_minute: 0,
            athlete_id: 3,
            game_activity_id: 1,
            kind: eventTypes.formation_position_view_change,
            relation: { id: 5 },
          },
        ],
      });
    });

    it('(game_activities ver) updates the activities returns the new list with updatePitchEventSwapActivities when a new athlete is chosen', () => {
      expect(
        updatePitchEventSwapActivities({
          gameActivities: mockNestedActivities,
          currentActivity: mockNestedActivities[0],
          positionData: { id: 6, position: { id: 6 } },
          athleteId: 3,
          eventIndex: 0,
        })
      ).toEqual({
        updatedFormationPositionChangeIndex: 0,
        updatedGameActivities: [
          {
            absolute_minute: 0,
            athlete_id: 1,
            game_activities: [
              {
                absolute_minute: 0,
                athlete_id: 1,
                game_activity_id: 1,
                kind: eventTypes.position_change,
                relation: { id: 6 },
              },
              {
                absolute_minute: 0,
                athlete_id: 3,
                game_activity_id: 1,
                kind: eventTypes.position_change,
                relation: { id: 5 },
              },
              {
                absolute_minute: 0,
                athlete_id: 1,
                game_activity_id: 1,
                kind: eventTypes.formation_position_view_change,
                relation: { id: 6 },
              },
              {
                absolute_minute: 0,
                athlete_id: 3,
                game_activity_id: 1,
                kind: eventTypes.formation_position_view_change,
                relation: { id: 5 },
              },
            ],
            kind: eventTypes.switch,
            relation: { id: 3 },
          },
        ],
      });
    });
  });

  describe('preparePenaltyReasonsOptions', () => {
    it('filters and returns the reasons into the appropriate options needed', () => {
      expect(preparePenaltyReasonsOptions(reasonsData)).toEqual({
        red_options: [
          {
            label:
              'Denying the opposing team a goal or an obvious goal-scoring opportunity by a handball offence (except a goalkeeper within their penalty area).',
            value: 3,
          },
          {
            label:
              "Denying a goal or an obvious goal-scoring opportunity to an opponent whose overall movement is towards the offender's goal by an offence punishable by a free kick (unless as outlined below).",
            value: 4,
          },
        ],
        yellow_options: [
          { label: 'Foul', value: 1 },
          { label: 'Backtalk', value: 2 },
        ],
      });
    });
  });
});

describe('checkIfYellowCardTimeIsValid', () => {
  const firstYellow = {
    id: 49808,
    kind: eventTypes.yellow,
    athlete_id: 92,
    user_id: null,
    minute: 20,
    additional_minute: null,
    absolute_minute: 20,
    relation_type: null,
    relation: null,
    game_period_id: 29,
    game_activity_id: null,
    activityIndex: 24,
  };

  const secondYellow = {
    id: 49809,
    kind: eventTypes.yellow,
    athlete_id: 92,
    user_id: null,
    minute: 25,
    additional_minute: null,
    absolute_minute: 25,
    relation_type: null,
    relation: null,
    game_period_id: 29,
    game_activity_id: null,
    activityIndex: 29,
  };
  const pitchActivities = [
    {
      id: 49810,
      kind: eventTypes.red,
      athlete_id: 92,
      user_id: null,
      minute: 28,
      additional_minute: null,
      absolute_minute: 28,
      relation_type: null,
      relation: null,
      game_period_id: 29,
      game_activity_id: null,
      activityIndex: 30,
    },
    secondYellow,
    firstYellow,
    {
      id: 49798,
      kind: eventTypes.goal,
      athlete_id: 92096,
      user_id: null,
      minute: 14,
      activityIndex: 10,
    },
  ];

  test('returns true if the 2nd yellow less than 1st yellow', () => {
    const eventPlayerId = 92;

    const parsedMinute = 10;

    _isEqual.mockReturnValue(true);

    const result = checkIfYellowCardTimeIsValid({
      pitchActivities,
      eventPlayerId,
      event: secondYellow,
      eventMinute: parsedMinute,
    });

    expect(result).toBe(true);
  });

  test('returns false if the 2nd yellow greater than 1st yellow', () => {
    const eventPlayerId = 92;

    const parsedMinute = 29;

    _isEqual.mockReturnValue(true);

    const result = checkIfYellowCardTimeIsValid({
      pitchActivities,
      eventPlayerId,
      event: secondYellow,
      eventMinute: parsedMinute,
    });

    expect(result).toBe(false);
  });

  test('returns true if the 1st yellow greater than 2nd yellow', () => {
    const eventPlayerId = 92;

    const parsedMinute = 30;

    _isEqual.mockReturnValue(true);

    const result = checkIfYellowCardTimeIsValid({
      pitchActivities,
      eventPlayerId,
      event: firstYellow,
      eventMinute: parsedMinute,
    });

    expect(result).toBe(true);
  });

  test('returns false if the 1st yellow less than 2nd yellow', () => {
    const eventPlayerId = 92;

    const parsedMinute = 10;

    _isEqual.mockReturnValue(true);

    const result = checkIfYellowCardTimeIsValid({
      pitchActivities,
      eventPlayerId,
      event: firstYellow,
      eventMinute: parsedMinute,
    });

    expect(result).toBe(false);
  });
});
