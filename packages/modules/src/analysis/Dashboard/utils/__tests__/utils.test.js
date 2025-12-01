import {
  DATA_SOURCES,
  DATA_SOURCE_TYPES,
} from '@kitman/modules/src/analysis/Dashboard/components/types';
import { humanizeTimestamp } from '@kitman/common/src/utils/dateFormatter';
import { DATA_STATUS } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import * as commonUtils from '@kitman/common/src/utils';

import {
  formatChartInputParams,
  formatDataSourceInputParams,
  getDataTypeSource,
  handleMedicalSubtypes,
  getParticipationStatus,
  sanitizeChartTitle,
  getChartTitle,
  getInputParamsFromDataSource,
  getNonEmptyParams,
  formatParamsToDataSource,
  sortCacheTimestamps,
  applyPopulationGrouping,
  formatPopulationPayload,
  getDashboardCachedAtContent,
  isValidSourceForMatchDayFilter,
  isValidSourceForSessionTypeFilter,
  isDashboardPivoted,
  updateDataSourceSubtypesForCodingSystems,
} from '../index';

jest.mock('@kitman/common/src/utils/dateFormatter', () => ({
  humanizeTimestamp: jest.fn(),
}));

describe('Analysis Dashboard | Utils', () => {
  const activityDataSourceTypes = [
    'Principle',
    'EventActivityType',
    'EventActivityTypeCategory',
    'PrincipleType',
    'PrincipleCategory',
    'PrinciplePhase',
    'EventActivityDrillLabel',
  ];

  const gameDataSourceTypes = ['GameActivity', 'GameResultAthlete'];

  describe('formatChartInputParams', () => {
    it.each([
      {
        description: 'returns an empty object when no data object is provided',
        input: 'TableMetric',
        data: undefined,
        expected: {},
      },
      {
        description: 'returns an empty object when passed an unknown type',
        input: 'unknownType',
        data: {},
        expected: {},
      },
      {
        description: 'returns the formatted input_params for TableMetric',
        input: 'TableMetric',
        data: [
          { key_name: 'kitman:athlete|age_in_years', name: 'Age (years)' },
        ],
        expected: {
          source: 'kitman:athlete',
          variable: 'age_in_years',
        },
      },
      ...activityDataSourceTypes.map((activityType) => ({
        description: `returns the formatted input_params for activity data type ${activityType}`,
        input: activityType,
        data: [{ ids: [1, 2, 3] }],
        expected: {
          type: activityType,
          ids: [1, 2, 3],
        },
      })),
      {
        description: 'returns correct inputs params for GameActivity',
        input: gameDataSourceTypes[0],
        data: [{ kinds: ['assist'], position_ids: [] }],
        expected: {
          formation_ids: undefined,
          kinds: ['assist'],
          position_ids: [],
        },
      },
      {
        description: 'returns correct inputs params for GameResultAthlete',
        input: gameDataSourceTypes[1],
        data: [{ result: 'win' }],
        expected: {
          result: 'win',
        },
      },
      {
        description:
          'returns correct inputs params for ParticipationLevel (no game involvement)',
        input: 'ParticipationLevel',
        data: [
          {
            ids: [3859],
            status: '',
          },
        ],
        expected: {
          participation_level_ids: [3859],
          status: '',
          involvement_event_type: null,
        },
      },
      {
        description:
          'returns correct inputs params for ParticipationLevel (with game involvement)',
        input: 'ParticipationLevel',
        data: [
          {
            ids: [3859],
            status: 'game_involvement',
          },
        ],
        expected: {
          participation_level_ids: [3859],
          status: 'game_involvement',
          involvement_event_type: 'game',
        },
      },
      {
        description:
          'returns correct data when the source type is MaturityEstimate (no data)',
        input: DATA_SOURCE_TYPES.maturityEstimate,
        data: undefined,
        expected: {},
      },
      {
        description:
          'returns correct data when the source type is MaturityEstimate (empty array)',
        input: DATA_SOURCE_TYPES.maturityEstimate,
        data: [],
        expected: { training_variable_ids: [{}] },
      },
    ])('$description', ({ input, data, expected }) => {
      expect(formatChartInputParams(input, data)).toStrictEqual(expected);
    });
  });

  describe('getDataTypeSource', () => {
    it.each([
      {
        input: '',
        expected: DATA_SOURCES.metric,
      },
      {
        input: DATA_SOURCE_TYPES.tableMetric,
        expected: DATA_SOURCES.metric,
      },
      {
        input: DATA_SOURCE_TYPES.principle,
        expected: DATA_SOURCES.activity,
      },
      {
        input: DATA_SOURCE_TYPES.eventActivityType,
        expected: DATA_SOURCES.activity,
      },
      {
        input: DATA_SOURCE_TYPES.eventActivityTypeCategory,
        expected: DATA_SOURCES.activity,
      },
      {
        input: DATA_SOURCE_TYPES.principleType,
        expected: DATA_SOURCES.activity,
      },
      {
        input: DATA_SOURCE_TYPES.principleCategory,
        expected: DATA_SOURCES.activity,
      },
      {
        input: DATA_SOURCE_TYPES.principlePhase,
        expected: DATA_SOURCES.activity,
      },
      {
        input: DATA_SOURCE_TYPES.eventActivityDrillLabel,
        expected: DATA_SOURCES.activity,
      },
      {
        input: DATA_SOURCE_TYPES.availability,
        expected: DATA_SOURCES.availability,
      },
      {
        input: DATA_SOURCE_TYPES.participationLevel,
        expected: DATA_SOURCES.participation,
      },
      {
        input: DATA_SOURCE_TYPES.gameActivity,
        expected: DATA_SOURCES.games,
      },
      {
        input: DATA_SOURCE_TYPES.gameResultAthlete,
        expected: DATA_SOURCES.games,
      },
      {
        input: DATA_SOURCE_TYPES.formula,
        expected: DATA_SOURCES.formula,
      },
      {
        input: 'MedicalInjury',
        expected: DATA_SOURCES.medical,
      },
      {
        input: 'MedicalIllness',
        expected: DATA_SOURCES.medical,
      },
      {
        input: 'RehabSessionExercise',
        expected: DATA_SOURCES.medical,
      },
      {
        input: DATA_SOURCE_TYPES.maturityEstimate,
        expected: DATA_SOURCES.growthAndMaturation,
      },
    ])(
      'returns ‘$expected’ if the source type is ‘$input’',
      ({ input, expected }) => expect(getDataTypeSource(input)).toBe(expected)
    );
  });

  describe('getInputParamsFromDataSource', () => {
    it('returns expected input params', () => {
      const dataSource = {
        data_source_type: 'RehabSessionExercise',
        subtypes: {
          exercise_ids: [10, 12],
          body_area_ids: [5],
          maintenance: true,
        },
      };

      const result = getInputParamsFromDataSource(dataSource, 'osics_10');
      expect(result).toStrictEqual({
        subtypes: {
          exercise_ids: [10, 12],
          body_area_ids: [5],
          maintenance: true,
        },
      });
    });

    it('returns expected input params when dataSource.data_source_type is DATA_SOURCE_TYPES.maturityEstimate', () => {
      const id = 3;
      const dataSource = {
        data_source_type: DATA_SOURCE_TYPES.maturityEstimate,
        training_variable_ids: [id],
      };

      const result = getInputParamsFromDataSource(dataSource, 'osics_10');
      expect(result).toStrictEqual({
        training_variable_ids: [id],
      });
    });

    it('returns expected input params for RehabSessionExercise with OSIICS-15 coding system and feature flag enabled', () => {
      window.setFlag('coding-system-osiics-15', true);

      const dataSource = {
        data_source_type: 'RehabSessionExercise',
        subtypes: {
          exercise_ids: [10, 12],
          body_area_ids: [5],
          maintenance: true,
        },
      };

      const result = getInputParamsFromDataSource(dataSource, 'osiics_15');
      expect(result).toStrictEqual({
        coding_system: 'osiics_15',
        subtypes: {
          exercise_ids: [10, 12],
          body_area_ids: [5],
          maintenance: true,
        },
      });

      window.setFlag('coding-system-osiics-15', false);
    });

    it('returns expected input params for MedicalInjury with OSIICS-15 coding system and feature flag enabled', () => {
      window.setFlag('coding-system-osiics-15', true);

      const dataSource = {
        data_source_type: 'MedicalInjury',
        subtypes: {
          pathology_ids: [1, 2],
          classification_ids: [3, 4],
        },
      };

      const result = getInputParamsFromDataSource(dataSource, 'osiics_15');
      expect(result).toStrictEqual({
        coding_system: 'osiics_15',
        subtypes: {
          pathology_ids: [1, 2],
          classification_ids: [3, 4],
        },
      });

      window.setFlag('coding-system-osiics-15', false);
    });

    it('returns expected input params for MedicalIllness with OSIICS-15 coding system and feature flag enabled', () => {
      window.setFlag('coding-system-osiics-15', true);

      const dataSource = {
        data_source_type: 'MedicalIllness',
        subtypes: {
          pathology_ids: [1, 2],
          body_area_ids: [5, 6],
        },
      };

      const result = getInputParamsFromDataSource(dataSource, 'osiics_15');
      expect(result).toStrictEqual({
        coding_system: 'osiics_15',
        subtypes: {
          pathology_ids: [1, 2],
          body_area_ids: [5, 6],
        },
      });

      window.setFlag('coding-system-osiics-15', false);
    });

    it('returns the correct input_params for TableMetric', () => {
      const result = getInputParamsFromDataSource({
        type: 'TableMetric',
        variable: 'variable',
        source: 'source',
      });

      expect(result).toStrictEqual({
        variable: 'variable',
        source: 'source',
      });
    });

    it('returns the correct input_params for Principle', () => {
      const result = getInputParamsFromDataSource({
        type: 'Principle',
        ids: 123,
      });

      expect(result).toStrictEqual({
        ids: 123,
      });
    });

    it('returns the correct input_params for ActivityType', () => {
      const result = getInputParamsFromDataSource({
        type: 'ActivityType',
        ids: 123,
      });

      expect(result).toStrictEqual({
        ids: 123,
      });
    });

    it('returns the correct input_params for Availability', () => {
      const result = getInputParamsFromDataSource({
        type: 'Availability',
        status: 'available',
      });

      expect(result).toStrictEqual({
        status: 'available',
      });
    });

    it('returns the correct input_params for GameActivity', () => {
      const result = getInputParamsFromDataSource({
        type: 'GameActivity',
        kinds: ['goal'],
        position_ids: [1, 2, 3],
        formation_ids: [],
      });

      expect(result).toStrictEqual({
        kinds: ['goal'],
        position_ids: [1, 2, 3],
        formation_ids: [],
      });
    });

    it('returns the correct input_params for GameResultAthlete', () => {
      const result = getInputParamsFromDataSource({
        type: 'GameResultAthlete',
        result: 'win',
      });

      expect(result).toStrictEqual({
        result: 'win',
      });
    });

    describe('when feature flag "multi-coding-pipeline-table-widget" is false', () => {
      const columnPanelDetails = {
        calculation: 'count_absolute',
        calculation_params: {},
        columnId: null,
        dataSource: {
          type: 'MedicalInjury',
          subtypes: {
            osics_pathology_ids: [754],
          },
        },
        source: 'medical',
      };

      it('should format inputParams with coding system for osics', () => {
        const expectedResult = {
          subtypes: {
            osics_pathology_ids: [754],
          },
        };
        const output = getInputParamsFromDataSource(
          columnPanelDetails.dataSource,
          codingSystemKeys.OSICS_10
        );
        expect(output).toStrictEqual(expectedResult);
      });
    });

    describe('when feature flag "multi-coding-pipeline-table-widget" is true', () => {
      beforeEach(() => {
        window.setFlag('multi-coding-pipeline-table-widget', true);
      });

      afterEach(() => {
        window.setFlag('multi-coding-pipeline-table-widget', false);
      });

      const columnPanelDetails = {
        calculation: 'count_absolute',
        calculation_params: {},
        columnId: null,
        dataSource: {
          type: 'MedicalInjury',
          subtypes: {
            osics_pathology_ids: [
              { value: 754, label: 'B06 Rubella [German measles]' },
            ],
          },
        },
        source: 'medical',
      };

      it('should format inputParams without coding system for icd_10_cm', () => {
        const expectedResult = {
          coding_system: 'icd_10_cm',
          subtypes: {
            pathology_ids: [754],
          },
        };
        const output = getInputParamsFromDataSource(
          columnPanelDetails.dataSource,
          'icd_10_cm'
        );

        expect(output).toStrictEqual(expectedResult);
      });
    });
  });

  describe('getNonEmptyParams', () => {
    it('returns params if there is a value', () => {
      const result = getNonEmptyParams('filters', { time_loss: [4] });
      expect(result).toStrictEqual({
        filters: {
          time_loss: [4],
        },
      });
    });

    it('returns empty if params is undefined', () => {
      const result = getNonEmptyParams('filters');
      expect(result).toStrictEqual({});
    });

    it('returns empty if params is empty', () => {
      const result = getNonEmptyParams('filters', {});
      expect(result).toStrictEqual({});
    });

    it('can be combined into multiple params', () => {
      const result1 = {
        ...getNonEmptyParams('filters', {
          event_type: ['game'],
          training_session: [1],
        }),
        ...getNonEmptyParams('calculation_params', {
          evaluation_period: 4,
        }),
      };

      expect(result1).toStrictEqual({
        filters: { event_type: ['game'], training_session: [1] },
        calculation_params: { evaluation_period: 4 },
      });

      const result2 = {
        ...getNonEmptyParams('filters', {
          event_type: ['game'],
          training_session: [1],
        }),
        ...getNonEmptyParams('calculation_params', {}),
      };

      expect(result2).toStrictEqual({
        filters: { event_type: ['game'], training_session: [1] },
      });
    });
  });

  describe('handleMedicalSubtypes', () => {
    it('returns filtered subtypes without codingSystemKey', () => {
      const subtypes = {
        code_ids: [1, 2],
        pathology_ids: null,
        classification_ids: [],
        body_area_ids: [5],
      };

      const result = handleMedicalSubtypes(subtypes);
      expect(result).toStrictEqual({
        code_ids: [1, 2],
        body_area_ids: [5],
      });
    });

    it('returns updated subtypes with codingSystemKey', () => {
      const subtypes = {
        osics_10_code_ids: [12, 45],
        osics_10_pathology_ids: [5],
      };

      const result = handleMedicalSubtypes(subtypes, 'osics_10');

      expect(result).toStrictEqual({
        code_ids: [12, 45],
        pathology_ids: [5],
      });
    });

    it('returns unmodified subtypes without codingSystemKey', () => {
      const subtypes = {
        osics_10_code_ids: [67, 45],
        osics_10_pathology_ids: ['XCC'],
      };

      const result = handleMedicalSubtypes(subtypes);

      expect(result).toStrictEqual(subtypes);
    });

    it('removes osiics_15_ prefix when coding-system-osiics-15 flag is enabled and codingSystemKey is osiics_15', () => {
      window.setFlag('coding-system-osiics-15', true);

      const subtypes = {
        osiics_15_pathology_ids: [1, 2],
        osiics_15_classification_ids: [3, 4],
        osiics_15_body_area_ids: [5, 6],
        osiics_15_code_ids: [7, 8],
        exercise_ids: [9, 10],
      };

      const result = handleMedicalSubtypes(subtypes, 'osiics_15');

      expect(result).toStrictEqual({
        pathology_ids: [1, 2],
        classification_ids: [3, 4],
        body_area_ids: [5, 6],
        code_ids: [7, 8],
        exercise_ids: [9, 10],
      });

      window.setFlag('coding-system-osiics-15', false);
    });

    it('does not remove prefix when codingSystemKey is not osiics_15', () => {
      window.setFlag('coding-system-osiics-15', true);

      const subtypes = {
        osiics_15_pathology_ids: [1, 2],
        osiics_15_classification_ids: [3, 4],
      };

      const result = handleMedicalSubtypes(subtypes, 'osics_10');

      expect(result).toStrictEqual({
        pathology_ids: [1, 2],
        classification_ids: [3, 4],
      });

      window.setFlag('coding-system-osiics-15', false);
    });
  });

  describe('formatDataSourceInputParams', () => {
    const mockFeatureFlags = window.featureFlags || {};
    beforeAll(() => {
      window.featureFlags = { ...mockFeatureFlags };
    });

    afterAll(() => {
      window.featureFlags = mockFeatureFlags;
    });

    it('returns an empty object when inputParams is null or undefined', () => {
      expect(formatDataSourceInputParams(null, 'MedicalInjury')).toStrictEqual(
        {}
      );
      expect(
        formatDataSourceInputParams(undefined, 'MedicalInjury')
      ).toStrictEqual({});
    });

    it('returns formatted subtypes when type is MedicalInjury and the feature flag is enabled', () => {
      window.setFlag('multi-coding-pipeline-table-widget', true);
      const inputParams = {
        subtypes: {
          code_ids: [1, 2],
          pathology_ids: null,
        },
      };
      const expectedOutput = {
        coding_system: 'osics_10',
        subtypes: {
          code_ids: [1, 2],
        },
      };
      expect(
        formatDataSourceInputParams(inputParams, 'MedicalInjury', 'osics_10')
      ).toStrictEqual(expectedOutput);
    });

    it('returns an empty object when inputParams.subtypes is empty or invalid for MedicalInjury', () => {
      window.setFlag('multi-coding-pipeline-table-widget', true);
      const inputParams = {
        subtypes: {
          pathology_ids: null,
          code_ids: null,
        },
      };
      expect(
        formatDataSourceInputParams(inputParams, 'MedicalInjury', 'osics_10')
      ).toStrictEqual({});
    });

    it('returns formatted subtypes when type is MedicalIllness and the feature flag is enabled', () => {
      window.setFlag('multi-coding-pipeline-table-widget', true);
      const inputParams = {
        subtypes: {
          osics_10_code_ids: [10, 12],
          osics_10_pathology_ids: [5],
        },
      };
      const expectedOutput = {
        coding_system: 'osics_10',
        subtypes: {
          code_ids: [10, 12],
          pathology_ids: [5],
        },
      };
      expect(
        formatDataSourceInputParams(inputParams, 'MedicalIllness', 'osics_10')
      ).toStrictEqual(expectedOutput);
    });

    it('returns formatted subtypes when type is RehabSessionExercise and the feature flag is enabled', () => {
      window.setFlag('multi-coding-pipeline-table-widget', true);
      const inputParams = {
        subtypes: {
          exercise_ids: [10, 12],
          body_area_ids: [5],
          maintenance: true,
        },
      };
      const expectedOutput = {
        coding_system: 'osics_10',
        subtypes: {
          exercise_ids: [10, 12],
          body_area_ids: [5],
          maintenance: true,
        },
      };
      expect(
        formatDataSourceInputParams(
          inputParams,
          'RehabSessionExercise',
          'osics_10'
        )
      ).toStrictEqual(expectedOutput);
    });

    it('returns formatted subtypes for RehabSessionExercise when the feature flag is disabled', () => {
      window.setFlag('multi-coding-pipeline-table-widget', false);
      const inputParams = {
        subtypes: {
          exercise_ids: [10, 12],
          body_area_ids: [5],
          maintenance: null,
        },
      };
      const expectedOutput = {
        subtypes: {
          exercise_ids: [10, 12],
          body_area_ids: [5],
        },
      };
      expect(
        formatDataSourceInputParams(inputParams, 'RehabSessionExercise')
      ).toStrictEqual(expectedOutput);
    });

    it('returns formatted subtypes for MedicalInjury when the feature flag is disabled', () => {
      window.setFlag('multi-coding-pipeline-table-widget', false);
      const inputParams = {
        subtypes: {
          code_ids: [1, 2],
          pathology_ids: null,
        },
      };
      const expectedOutput = {
        subtypes: {
          code_ids: [1, 2],
        },
      };
      expect(
        formatDataSourceInputParams(inputParams, 'MedicalInjury')
      ).toStrictEqual(expectedOutput);
    });
  });

  describe('getParticipationStatus', () => {
    it('returns "game_involvement" when hasEventType is true', () => {
      expect(getParticipationStatus([1, 2, 3], true)).toBe('game_involvement');
      expect(getParticipationStatus([], true)).toBe('game_involvement');
    });

    it('returns "participation_status" when hasEventType is false or undefined and ids is empty', () => {
      expect(getParticipationStatus([], false)).toBe('participation_status');
      expect(getParticipationStatus([])).toBe('participation_status');
    });

    it('returns "participation_levels" when hasEventType is false or undefined and ids is not empty', () => {
      expect(getParticipationStatus([1, 2, 3], false)).toBe(
        'participation_levels'
      );
      expect(getParticipationStatus([1])).toBe('participation_levels');
    });
  });

  describe('sanitizeChartTitle', () => {
    it('returns title when title does not include %', () => {
      expect(sanitizeChartTitle('Training Mins - Sum')).toBe(
        'Training Mins - Sum'
      );
    });

    it('returns sanitized title with % replaced as %25', () => {
      expect(sanitizeChartTitle('% Difference - Sum')).toBe(
        '%25 Difference - Sum'
      );
      expect(sanitizeChartTitle('% Difference % - Sum')).toBe(
        '%25 Difference %25 - Sum'
      );
    });

    it('returns title when the title has already been santized', () => {
      expect(sanitizeChartTitle('%25 Difference - Min')).toBe(
        '%25 Difference - Min'
      );
    });
  });

  describe('getChartTitle', () => {
    it('returns title when title does not include %', () => {
      expect(getChartTitle('Training Mins - Sum')).toBe('Training Mins - Sum');
    });

    it('returns title replacing %25 with %', () => {
      expect(getChartTitle('%25 Difference - Sum')).toBe('% Difference - Sum');
      expect(getChartTitle('%25 Difference %25 - Sum')).toBe(
        '% Difference % - Sum'
      );
    });
  });

  describe('formatParamsToDataSource', () => {
    it('formats tableMetric params as expected', () => {
      const params = {
        type: DATA_SOURCE_TYPES.tableMetric,
        data: [{ key_name: 'combination|%_difference' }],
      };
      const result = formatParamsToDataSource(params);
      expect(result).toEqual({
        type: DATA_SOURCE_TYPES.tableMetric,
        key_name: 'combination|%_difference',
        source: 'combination',
        variable: '%_difference',
      });
    });

    it('formats principle params as expected', () => {
      const params = {
        type: DATA_SOURCE_TYPES.principle,
        data: [{ ids: [1, 2, 3] }],
      };
      const result = formatParamsToDataSource(params);
      expect(result).toEqual({
        type: DATA_SOURCE_TYPES.principle,
        ids: [1, 2, 3],
      });
    });

    it('formats principleType params as expected', () => {
      const params = {
        type: DATA_SOURCE_TYPES.principleType,
        data: [{ ids: 2 }],
      };
      const result = formatParamsToDataSource(params);
      expect(result).toEqual({
        type: DATA_SOURCE_TYPES.principleType,
        ids: 2,
      });
    });

    it('formats participationLevel params as expected', () => {
      const params = {
        type: DATA_SOURCE_TYPES.participationLevel,
        data: [{ ids: [1, 2], status: 'participation_levels' }],
      };
      const result = formatParamsToDataSource(params);
      expect(result).toEqual({
        type: DATA_SOURCE_TYPES.participationLevel,
        ids: [1, 2],
        status: 'participation_levels',
        event: null,
      });
    });

    it('formats participationLevel params with game_involvement as expected', () => {
      const params = {
        type: DATA_SOURCE_TYPES.participationLevel,
        data: [{ ids: [1, 2], status: 'game_involvement', event: 'game' }],
      };
      const result = formatParamsToDataSource(params);
      expect(result).toEqual({
        type: DATA_SOURCE_TYPES.participationLevel,
        ids: [1, 2],
        status: 'game_involvement',
        event: 'game',
      });
    });

    it('formats gameActivity params as expected', () => {
      const params = {
        type: DATA_SOURCE_TYPES.gameActivity,
        data: [
          {
            kinds: ['position_change'],
            formation_ids: [],
            position_ids: [2, 3],
          },
        ],
      };
      const result = formatParamsToDataSource(params);
      expect(result).toEqual({
        type: DATA_SOURCE_TYPES.gameActivity,
        kinds: ['position_change'],
        formation_ids: [],
        position_ids: [2, 3],
      });
    });

    it('formats gameResultAthlete params as expected', () => {
      const params = {
        type: DATA_SOURCE_TYPES.gameResultAthlete,
        data: [{ result: 'win' }],
      };
      const result = formatParamsToDataSource(params);
      expect(result).toEqual({
        type: DATA_SOURCE_TYPES.gameResultAthlete,
        result: 'win',
        kinds: undefined,
      });
    });

    it('formats availability params as expected', () => {
      const params = {
        type: DATA_SOURCE_TYPES.availability,
        data: [{ status: 'available' }],
      };
      const result = formatParamsToDataSource(params);
      expect(result).toEqual({
        type: DATA_SOURCE_TYPES.availability,
        status: 'available',
      });
    });

    it('formats maturity estimate params as expected', () => {
      const id = 3;
      const params = {
        type: DATA_SOURCE_TYPES.maturityEstimate,
        data: [id],
      };
      const result = formatParamsToDataSource(params);
      expect(result).toEqual({
        type: DATA_SOURCE_TYPES.maturityEstimate,
        training_variable_ids: [id],
      });
    });

    it('returns empty object for unknown type', () => {
      const params = {
        type: 'unknownType',
        data: [{}],
      };
      const result = formatParamsToDataSource(params);
      expect(result).toEqual({});
    });
  });

  describe('sortCacheTimestamps', () => {
    it('sorts the timestamps from oldest to newest', () => {
      const timestamps = [
        '2025-04-24T14:55:29.000+00:00', // newest
        '2025-03-24T14:55:29.120+00:00', // oldest
      ];
      const result = sortCacheTimestamps(timestamps);

      const sortedTimestampsValues = result.map((date) => date.toISOString());

      expect(sortedTimestampsValues).toEqual([
        '2025-03-24T14:55:29.120Z',
        '2025-04-24T14:55:29.000Z',
      ]);
    });

    it('handles empty strings and null values', () => {
      const timestamps = ['2025-04-24T14:55:29.000+00:00', '', null];
      const result = sortCacheTimestamps(timestamps);

      const sortedTimestampsValues = result.map((date) => date.toISOString());

      expect(sortedTimestampsValues).toEqual(['2025-04-24T14:55:29.000Z']);
    });
  });

  describe('applyPopulationGrouping', () => {
    it('returns population with null config when grouping is "no_grouping"', () => {
      const population = [{ id: 1 }, { id: 2 }];
      const groupings = ['no_grouping', 'no_grouping'];
      const result = applyPopulationGrouping(population, groupings);
      expect(result).toStrictEqual([
        { population: { id: 1 }, config: null },
        { population: { id: 2 }, config: null },
      ]);
    });

    it('returns population with groupings config when grouping is provided', () => {
      const population = [{ id: 1 }, { id: 2 }];
      const groupings = ['group1', 'group2'];
      const result = applyPopulationGrouping(population, groupings);
      expect(result).toStrictEqual([
        { population: { id: 1 }, config: { groupings: ['group1'] } },
        { population: { id: 2 }, config: { groupings: ['group2'] } },
      ]);
    });

    it('handles mixed groupings correctly', () => {
      const population = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const groupings = ['no_grouping', 'group1', 'no_grouping'];
      const result = applyPopulationGrouping(population, groupings);
      expect(result).toStrictEqual([
        { population: { id: 1 }, config: null },
        { population: { id: 2 }, config: { groupings: ['group1'] } },
        { population: { id: 3 }, config: null },
      ]);
    });
  });

  describe('formatPopulationPayload', () => {
    const population = [{ id: 1 }, { id: 2 }, { id: 3 }];

    it('returns single population object with null config in edit mode', () => {
      const result = formatPopulationPayload(population, undefined, true);
      expect(result).toStrictEqual({
        population: { id: 1 },
        config: null,
      });
    });

    it('returns single population object with groupings config in edit mode', () => {
      const config = { groupings: ['group1'] };
      const result = formatPopulationPayload(population, config, true);
      expect(result).toStrictEqual({
        population: { id: 1 },
        config: { groupings: ['group1'] },
      });
    });

    it('calls applyPopulationGrouping and wraps result in _json when not in edit mode and config is provided', () => {
      const config = { groupings: ['group1', 'group2'] };
      const result = formatPopulationPayload(population, config, false);
      expect(result).toStrictEqual({
        bulk_population: [
          { population: { id: 1 }, config: { groupings: ['group1'] } },
          { population: { id: 2 }, config: { groupings: ['group2'] } },
          { population: { id: 3 }, config: null },
        ],
      });
    });

    it('defaults to null when config is not provided', () => {
      const result = formatPopulationPayload(population, null, false);
      expect(result).toStrictEqual({
        bulk_population: [
          { population: { id: 1 }, config: null },
          { population: { id: 2 }, config: null },
          { population: { id: 3 }, config: null },
        ],
      });
    });
  });

  describe('isValidSourceForMatchDayFilter', () => {
    it.each([
      {
        input: DATA_SOURCES.metric,
        expected: true,
      },
      {
        input: DATA_SOURCES.activity,
        expected: true,
      },
      {
        input: DATA_SOURCES.availability,
        expected: false,
      },
      {
        input: DATA_SOURCES.participation,
        expected: true,
      },
      {
        input: DATA_SOURCES.medical,
        expected: false,
      },
      {
        input: DATA_SOURCES.medical,
        expected: false,
      },
      {
        input: DATA_SOURCES.games,
        expected: false,
      },
      {
        input: DATA_SOURCES.formula,
        expected: false,
      },
      {
        input: DATA_SOURCES.growthAndMaturation,
        expected: false,
      },
    ])('returns ‘$expected’ if the source is ‘$input’', ({ input, expected }) =>
      expect(isValidSourceForMatchDayFilter(input)).toBe(expected)
    );
  });

  describe('isValidSourceForSessionTypeFilter', () => {
    it.each([
      {
        input: DATA_SOURCES.metric,
        expected: true,
      },
      {
        input: DATA_SOURCES.activity,
        expected: true,
      },
      {
        input: DATA_SOURCES.availability,
        expected: true,
      },
      {
        input: DATA_SOURCES.participation,
        expected: true,
      },
      {
        input: DATA_SOURCES.medical,
        expected: true,
      },
      {
        input: DATA_SOURCES.medical,
        expected: true,
      },
      {
        input: DATA_SOURCES.games,
        expected: true,
      },
      {
        input: DATA_SOURCES.formula,
        expected: true,
      },
      {
        input: DATA_SOURCES.growthAndMaturation,
        expected: false,
      },
    ])('returns ‘$expected’ if the source is ‘$input’', ({ input, expected }) =>
      expect(isValidSourceForSessionTypeFilter(input)).toBe(expected)
    );
  });

  describe('getDashboardCachedAtContent', () => {
    beforeEach(() => {
      humanizeTimestamp.mockReturnValue('a minute ago');
      window.setFlag('rep-table-widget-caching', true);
      window.setFlag('rep-charts-v2-caching', true);
    });

    afterEach(() => {
      window.setFlag('rep-table-widget-caching', false);
      window.setFlag('rep-charts-v2-caching', false);
    });
    it('returns an empty string if caching is disabled or cachedAt is not provided', () => {
      const result = getDashboardCachedAtContent(null, null, null);
      expect(result).toBe('');
    });

    it('returns "Calculating..." if dataStatus is caching', () => {
      const result = getDashboardCachedAtContent(
        '2021-01-01T00:00:00Z',
        DATA_STATUS.caching,
        'en'
      );
      expect(result).toBe('Calculating...');
    });

    it('returns the formatted cachedAt timestamp if dataStatus is not caching', () => {
      const result = getDashboardCachedAtContent(
        '2021-01-01T00:00:00Z',
        DATA_STATUS.success,
        'en'
      );
      expect(result).toBe('Last Calculated: a minute ago');
    });

    it('returns an empty string if both flags are turned off', () => {
      window.setFlag('rep-table-widget-caching', false);
      window.setFlag('rep-charts-v2-caching', false);
      const result = getDashboardCachedAtContent(
        '2021-01-01T00:00:00Z',
        DATA_STATUS.success,
        'en'
      );
      expect(result).toBe('');
    });
  });

  describe('isDashboardPivoted', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('returns true when pivot search param exists (truthy)', () => {
      jest.spyOn(commonUtils, 'searchParams').mockReturnValue('1');
      expect(isDashboardPivoted()).toBe(true);
    });

    it('returns false when pivot search param does not exist', () => {
      jest.spyOn(commonUtils, 'searchParams').mockReturnValue(undefined);
      expect(isDashboardPivoted()).toBe(false);
    });
  });

  describe('updateDataSourceSubtypesForCodingSystems', () => {
    const osics10MockSubtypes = {
      osics_10_pathology_ids: [
        {
          value: 1,
          label: 'Test',
        },
        {
          value: 2,
          label: 'Test 2',
        },
      ],
      osics_10_classification_ids: [1, 2, 3, 4],
      osics_10_code_ids: [
        {
          value: 1,
          label: 'Test',
        },
        {
          value: 2,
          label: 'Test 2',
        },
      ],
    };

    const osics15MockSubtypes = {
      osiics_15_pathology_ids: [1, 2],
      osiics_15_classification_ids: [1, 2, 3, 4],
      osiics_15_code_ids: [1, 2],
    };

    it.each([
      {
        name: 'osics_10',
        subtypes: osics10MockSubtypes,
        expected: {
          pathology_ids: [1, 2],
          classification_ids: [1, 2, 3, 4],
          code_ids: [1, 2],
        },
      },
      {
        name: 'osiics_15',
        subtypes: osics15MockSubtypes,
        expected: {
          pathology_ids: [1, 2],
          classification_ids: [1, 2, 3, 4],
          code_ids: [1, 2],
        },
      },
    ])(
      'should return subtypes without coding system for "$name"',
      ({ subtypes, expected }) => {
        const result = updateDataSourceSubtypesForCodingSystems(subtypes);
        expect(result).toEqual(expected);
      }
    );
  });
});
