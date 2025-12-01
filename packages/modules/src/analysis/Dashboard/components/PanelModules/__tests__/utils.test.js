import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import {
  isDataSourceValid,
  isDateRangeValid,
  getCodingSystemFilterOptions,
  isValidOptionLength,
  isValidFormulaGrouping,
  getTimePeriodValue,
} from '../utils';

describe('PanelModules|utils', () => {
  describe('isDataSourceValid', () => {
    it('returns invalid when datasource is empty without type', () => {
      expect(isDataSourceValid({})).toEqual(false);
    });
    it('returns valid when datasource is not empty on regular type', () => {
      expect(
        isDataSourceValid({
          type: 'TableMetric',
          source: 'key',
          variable: 'value',
        })
      ).toEqual(true);
    });

    it('returns invalid if status is participation_status and ids are selected for ParticipationLevel type', () => {
      expect(
        isDataSourceValid({
          type: 'ParticipationLevel',
          status: 'participation_status',
          ids: [123],
        })
      ).toEqual(false);
    });

    it('returns valid if status is participation_status and ids are empty for ParticipationLevel type', () => {
      expect(
        isDataSourceValid({
          type: 'ParticipationLevel',
          status: 'participation_status',
          ids: [],
        })
      ).toEqual(true);
    });

    it('returns invalid if status is participation_level and ids are empty for ParticipationLevel type', () => {
      expect(
        isDataSourceValid({
          type: 'ParticipationLevel',
          status: 'participation_levels',
          ids: [],
        })
      ).toEqual(false);
    });

    it('returns valid if status is participation_level and ids are not empty for ParticipationLevel type', () => {
      expect(
        isDataSourceValid({
          type: 'ParticipationLevel',
          status: 'participation_levels',
          ids: [12, 34],
        })
      ).toEqual(true);
    });

    it('returns valid if MedicalIllness is a type', () => {
      expect(
        isDataSourceValid({
          type: 'MedicalIllness',
        })
      ).toEqual(true);
    });

    it('returns valid if MedicalInjury is a type', () => {
      expect(
        isDataSourceValid({
          type: 'MedicalInjury',
        })
      ).toEqual(true);
    });

    it('returns valid if RehabSessionExercise is a type', () => {
      expect(
        isDataSourceValid({
          type: 'RehabSessionExercise',
        })
      ).toEqual(true);
    });

    it('returns valid if GameActivity is a type with position_change and position_ids', () => {
      expect(
        isDataSourceValid({
          type: 'GameActivity',
          kinds: ['position_change'],
          position_ids: [1, 2, 3],
        })
      ).toEqual(true);
    });

    it('returns invalid if GameActivity is a type with no or empty position_ids', () => {
      expect(
        isDataSourceValid({
          type: 'GameActivity',
          kinds: ['position_change'],
          position_ids: [],
        })
      ).toEqual(false);
    });

    it('returns invalid if GameActivity is a type with no or empty position_ids and/or kinds', () => {
      expect(
        isDataSourceValid({
          type: 'GameActivity',
          kinds: [],
          position_ids: [],
        })
      ).toEqual(false);

      expect(
        isDataSourceValid({
          type: 'GameActivity',
          kinds: [],
        })
      ).toEqual(false);
    });

    it('returns valid if GameActivity is cards with type red or yello', () => {
      expect(
        isDataSourceValid({
          type: 'GameActivity',
          kinds: ['red', 'yellow'],
        })
      ).toEqual(true);
      expect(
        isDataSourceValid({
          type: 'GameActivity',
          kinds: ['red'],
        })
      ).toEqual(true);
      expect(
        isDataSourceValid({
          type: 'GameActivity',
          kinds: ['yellow'],
        })
      ).toEqual(true);
    });

    it('returns valid if GameActivity is a type with formation_ids and kinds', () => {
      expect(
        isDataSourceValid({
          type: 'GameActivity',
          kinds: ['formation_change'],
          formation_ids: [68],
        })
      ).toEqual(true);
    });

    it('returns invalid if GameActivity is a type with no or empty formation_ids and/or kinds', () => {
      expect(
        isDataSourceValid({
          type: 'GameActivity',
          kinds: ['formation_change'],
          formation_ids: [],
        })
      ).toEqual(false);

      expect(
        isDataSourceValid({
          type: 'GameActivity',
          kinds: [],
        })
      ).toEqual(false);
    });
    it('returns valid if ParticipationLevel is the type and game_involvement the status', () => {
      expect(
        isDataSourceValid({
          type: 'ParticipationLevel',
          status: 'game_involvement',
          event: 'minutes',
        })
      ).toEqual(true);
    });

    it('returns valid if ParticipationLevel is the type game_involvement', () => {
      expect(
        isDataSourceValid({
          type: 'ParticipationLevel',
          status: 'game_involvement',
          formation_ids: [68],
        })
      ).toEqual(true);
    });

    describe('isValidOptionLength', () => {
      it('returns true when options is a non-empty array', () => {
        expect(isValidOptionLength([1, 2, 3])).toEqual(true);
      });

      it('returns false when options is not an array', () => {
        expect(isValidOptionLength({})).toEqual(false);
        expect(isValidOptionLength(null)).toEqual(false);
        expect(isValidOptionLength(undefined)).toEqual(false);
        expect(isValidOptionLength(123)).toEqual(false);
      });
    });
  });

  describe('isDateRangeValid', () => {
    it('returns invalid when timePeriodId is empty', () => {
      expect(isDateRangeValid('')).toEqual(false);
    });

    it('returns invalid when timePeriodId is last_x_events & periodLength is empty', () => {
      expect(isDateRangeValid('last_x_events')).toEqual(false);
    });

    it('returns invalid when timePeriodId is last_x_events & periodLength is 0', () => {
      expect(isDateRangeValid('last_x_events', {}, 0)).toEqual(false);
    });

    it('returns valid when timePeriodId is last_x_events & periodLength has a value', () => {
      expect(isDateRangeValid('last_x_events', {}, 5)).toEqual(true);
    });

    it('returns invalid when timePeriodId is last_x_days & periodLength is  empty', () => {
      expect(isDateRangeValid('last_x_days')).toEqual(false);
    });

    it('returns invalid when timePeriodId is last_x_days & periodLength is 0', () => {
      expect(isDateRangeValid('last_x_days', {}, 0)).toEqual(false);
    });

    it('returns valid when timePeriodId is last_x_days & periodLength has a value', () => {
      expect(isDateRangeValid('last_x_days', {}, 5)).toEqual(true);
    });

    it('returns invalid when timePeriodId is custom_date_range & dateRange is empty', () => {
      expect(isDateRangeValid('custom_date_range', {})).toEqual(false);
    });
  });

  describe('getCodingSystemFilterOptions', () => {
    const getDefaultCodingSystemFilterOptions = (codingSystemKey) => [
      {
        label: 'Pathology',
        value: `${codingSystemKey}_pathology_ids`,
      },
      {
        label: 'Body area',
        value: `${codingSystemKey}_body_area_ids`,
      },
      {
        label: 'Code',
        value: `${codingSystemKey}_code_ids`,
      },
    ];

    it('should not return classifications if coding system is ICD', () => {
      const icdKey = codingSystemKeys.ICD;
      expect(getCodingSystemFilterOptions(icdKey)).toEqual(
        getDefaultCodingSystemFilterOptions(icdKey)
      );
    });

    it('should return default options with classifications if coding system is not ICD', () => {
      const osicsKey = codingSystemKeys.OSICS_10;
      const sortedFilterOptions = getCodingSystemFilterOptions(osicsKey).sort(
        (a, b) => a.label.localeCompare(b.label)
      );
      const expectedMatch = [
        ...getDefaultCodingSystemFilterOptions(osicsKey),
        {
          label: 'Classification',
          value: `${osicsKey}_classification_ids`,
        },
      ].sort((a, b) => a.label.localeCompare(b.label));

      expect(sortedFilterOptions).toEqual(expectedMatch);
    });

    it('should not return code option if coding system is clinical impresssions', () => {
      const ciKey = codingSystemKeys.CLINICAL_IMPRESSIONS;
      const results = getCodingSystemFilterOptions(ciKey);
      expect(results).toEqual([
        {
          label: 'Pathology',
          value: `${ciKey}_pathology_ids`,
        },
        {
          label: 'Classification',
          value: `${ciKey}_classification_ids`,
        },
        {
          label: 'Body area',
          value: `${ciKey}_body_area_ids`,
        },
      ]);
    });
  });

  describe('getCodingSystemFilterOptions for multicoding sytstem', () => {
    beforeEach(() => {
      window.setFlag('multi-coding-pipeline-table-widget', true);
    });

    afterEach(() => {
      window.setFlag('multi-coding-pipeline-table-widget', false);
    });

    const expected = [
      {
        label: 'Pathology',
        value: 'pathology_ids',
      },
      {
        label: 'Classification',
        value: 'classification_ids',
      },
      {
        label: 'Body area',
        value: 'body_area_ids',
      },
      {
        label: 'Code',
        value: 'code_ids',
      },
    ];

    it('should not return classifications if coding system is ICD', () => {
      const osicsKey = codingSystemKeys.OSICS_10;
      expect(getCodingSystemFilterOptions(osicsKey)).toEqual(expected);
    });
  });

  describe('isValidFormulaGrouping', () => {
    it('returns false when groupings is null or undefined', () => {
      expect(isValidFormulaGrouping(null)).toEqual(false);
      expect(isValidFormulaGrouping(undefined)).toEqual(false);
    });

    it('returns false when groupings is an empty object', () => {
      expect(isValidFormulaGrouping({})).toEqual(false);
    });

    it('returns true when groupings is a non-empty object', () => {
      expect(isValidFormulaGrouping(['time'])).toEqual(true);
    });

    describe('getTimePeriodValue', () => {
      it('returns original timePeriod when config is undefined', () => {
        expect(getTimePeriodValue('this_season_so_far')).toStrictEqual(
          'this_season_so_far'
        );
      });

      it('returns original timePeriod when config has no event_types', () => {
        expect(getTimePeriodValue('this_season_so_far', {})).toEqual(
          'this_season_so_far'
        );
      });

      it('returns lastXGames when only game event type is present', () => {
        const config = { event_types: ['game'] };
        expect(getTimePeriodValue('custom_period', config)).toEqual(
          'last_x_games'
        );
      });

      it('returns lastXSessions when only training session event type is present', () => {
        const config = { event_types: ['training_session'] };
        expect(getTimePeriodValue('last_x_events', config)).toEqual(
          'last_x_sessions'
        );
      });

      it('returns lastXGamesAndSessions when both game and training session event types are present', () => {
        const config = { event_types: ['game', 'training_session'] };
        expect(getTimePeriodValue('last_x_events', config)).toEqual(
          'last_x_games_and_sessions'
        );
      });

      it('returns lastXGamesAndSessions when both event types plus additional types are present', () => {
        const config = {
          event_types: ['game', 'training_session', 'other_event'],
        };
        expect(getTimePeriodValue('last_x_events', config)).toEqual(
          'last_x_games_and_sessions'
        );
      });
    });
  });
});
