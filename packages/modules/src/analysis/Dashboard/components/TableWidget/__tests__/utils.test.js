import { data as SQUAD_ATHLETES_DATA } from '@kitman/services/src/mocks/handlers/getSquadAthletes';
import {
  data as GROUPS_DATA,
  data as segmentData,
} from '@kitman/services/src/mocks/handlers/analysis/groups';
import {
  data as LABELS_DATA,
  data as labelData,
} from '@kitman/services/src/mocks/handlers/analysis/labels';
import { mergeWithEmptySelection } from '@kitman/components/src/Athletes/utils';
import { EMPTY_SELECTION } from '@kitman/components/src/Athletes/constants';
import colors from '@kitman/common/src/variables/colors';
import { humanizeTimestamp } from '@kitman/common/src/utils/dateFormatter';
// eslint-disable-next-line jest/no-mocks-import
import {
  ADD_FORMULA_COLUMN_MOCK,
  ACTIVE_FORMULA_MOCK,
  ADD_FORMULA_CHART_MOCK,
} from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/tableWidget';
// eslint-disable-next-line jest/no-mocks-import
import { MOCK_CATEGORIZED_GROUPINGS } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/chartBuilder';
import { FORMULA_INPUT_IDS } from '@kitman/modules/src/analysis/shared/constants';
import {
  NO_GROUPING,
  NOT_AVAILABLE,
  DASH,
} from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/consts';
import { DATA_SOURCES } from '@kitman/modules/src/analysis/Dashboard/components/types';

import {
  getSortedTablePopulation,
  getTableRowMetrics,
  getTableRowTimeScopes,
  getTablePopulation,
  getCalculationDropdownOptions,
  getCalculationTitle,
  getSummaryName,
  getSummaryValue,
  shouldFormatCell,
  getCellDetails,
  getCellColour,
  getRankingCalculation,
  getFormattedCellValue,
  getPopulationSelectedItems,
  getAvailabilityCalculationOptions,
  prepareColumnFormulaSubmissionData,
  prepareChartFormulaSubmissionData,
  hasValidComparativePeriod,
  hasValidTimePeriod,
  hasRequiredCalculationValues,
  isValidCalculation,
  copyPrimaryGrouping,
  getInputParamsFromSource,
  filterGroupingsByCategory,
  filterGroupingsByKey,
  addLabelToDynamicRows,
  hasValidGrouping,
  getCachedAtRolloverContent,
  getColumnCachedAt,
  sortDynamicRows,
} from '../utils';
import {
  TABLE_WIDGET_DATA_SOURCES,
  TABLE_WIDGET_DATA_SOURCE_TYPES,
} from '../types';

jest.mock('@kitman/common/src/utils/dateFormatter', () => ({
  humanizeTimestamp: jest.fn(),
}));

describe('utils', () => {
  describe('TableWidget utils', () => {
    describe('getSortedTablePopulation', () => {
      it('returns the table population in the order which is passed in', () => {
        expect(
          getSortedTablePopulation(
            [
              { id: '999', name: 'Left Back' },
              { id: 'entire_squad', name: 'Entire Squad' },
              { id: '123', name: 'Defenders' },
            ],
            ['123', '999', 'entire_squad']
          )
        ).toEqual([
          { id: '123', name: 'Defenders' },
          { id: '999', name: 'Left Back' },
          { id: 'entire_squad', name: 'Entire Squad' },
        ]);
      });

      it('returns any population values which are not in the sorted ids array at the end', () => {
        expect(
          getSortedTablePopulation(
            [
              { id: '123333', name: 'Strikers' },
              { id: '664', name: 'Goalkeepers' },
              { id: '999', name: 'Left Back' },
              { id: 'entire_squad', name: 'Entire Squad' },
              { id: '123', name: 'Defenders' },
            ],
            ['123', 'entire_squad']
          )
        ).toEqual([
          { id: '123', name: 'Defenders' },
          { id: 'entire_squad', name: 'Entire Squad' },
          { id: '123333', name: 'Strikers' },
          { id: '664', name: 'Goalkeepers' },
          { id: '999', name: 'Left Back' },
        ]);
      });
    });

    describe('getTableRowMetrics', () => {
      const tableMetrics = [
        { id: 1, name: 'Test Metric 1' },
        { id: 6, name: 'Test Metric 6' },
        { id: 3, name: 'Test Metric 3' },
        { id: 736, name: 'Test Metric 736' },
        { id: 234, name: 'Test Metric 234' },
      ];

      describe('when not sorting', () => {
        const sortedMetricIds = [];

        it('returns in the given order', () => {
          expect(getTableRowMetrics(tableMetrics, sortedMetricIds)).toEqual([
            { id: 1, name: 'Test Metric 1' },
            { id: 6, name: 'Test Metric 6' },
            { id: 3, name: 'Test Metric 3' },
            { id: 736, name: 'Test Metric 736' },
            { id: 234, name: 'Test Metric 234' },
          ]);
        });
      });

      describe('when sorting', () => {
        const sortedMetricIds = [234, 3, 1, 6, 736];

        it('returns in the sorted order', () => {
          expect(getTableRowMetrics(tableMetrics, sortedMetricIds)).toEqual([
            { id: 234, name: 'Test Metric 234' },
            { id: 3, name: 'Test Metric 3' },
            { id: 1, name: 'Test Metric 1' },
            { id: 6, name: 'Test Metric 6' },
            { id: 736, name: 'Test Metric 736' },
          ]);
        });
      });
    });

    describe('getTableRowTimeScopes', () => {
      const timeScopes = [
        { id: 1, time_period: 'today' },
        { id: 6, time_period: 'this_season' },
        { id: 3, time_period: 'yesterday' },
        { id: 736, time_period: 'pre_season' },
        { id: 234, time_period: 'today' },
      ];

      describe('when not sorting', () => {
        const sortedTimeScopeIds = [];

        it('returns in the given order', () => {
          expect(getTableRowTimeScopes(timeScopes, sortedTimeScopeIds)).toEqual(
            [
              { id: 1, time_period: 'today' },
              { id: 6, time_period: 'this_season' },
              { id: 3, time_period: 'yesterday' },
              { id: 736, time_period: 'pre_season' },
              { id: 234, time_period: 'today' },
            ]
          );
        });
      });

      describe('when sorting', () => {
        const sortedTimeScopeIds = ['234', '3', '1', '6', '736'];

        it('returns in the sorted order', () => {
          expect(getTableRowTimeScopes(timeScopes, sortedTimeScopeIds)).toEqual(
            [
              { id: 234, time_period: 'today' },
              { id: 3, time_period: 'yesterday' },
              { id: 1, time_period: 'today' },
              { id: 6, time_period: 'this_season' },
              { id: 736, time_period: 'pre_season' },
            ]
          );
        });
      });
    });

    describe('getTablePopulation', () => {
      const squadAthletes = {
        position_groups: [
          {
            id: '123',
            name: 'Defenders',
            positions: [
              {
                id: '999',
                name: 'Left Back',
                athletes: [{ id: '1234567', fullname: 'Test' }],
              },
            ],
          },
        ],
      };
      const squads = [{ id: '9876', name: 'First Team' }];

      describe('when not sorting', () => {
        const sortedPopulationIds = [];

        it('returns Entire Squad and id when applies_to_squad is true', () => {
          expect(
            getTablePopulation(
              {
                applies_to_squad: true,
                position_groups: [],
                positions: [],
                athletes: [],
                all_squads: false,
                squads: [],
              },
              squadAthletes,
              squads,
              sortedPopulationIds
            )
          ).toEqual([{ id: 'entire_squad', name: 'Entire Squad' }]);
        });
        it('returns the Position Group and id when a position group is selected', () => {
          expect(
            getTablePopulation(
              {
                applies_to_squad: false,
                position_groups: ['123'],
                positions: [],
                athletes: [],
                all_squads: false,
                squads: [],
              },
              squadAthletes,
              squads,
              sortedPopulationIds
            )
          ).toEqual([{ id: '123', name: 'Defenders' }]);
        });
        it('returns the Position and id when a position is selected', () => {
          expect(
            getTablePopulation(
              {
                applies_to_squad: false,
                position_groups: [],
                positions: ['999'],
                athletes: [],
                all_squads: false,
                squads: [],
              },
              squadAthletes,
              squads,
              sortedPopulationIds
            )
          ).toEqual([{ id: '999', name: 'Left Back' }]);
        });
        it('returns the Athlete and id when an athlete is selected', () => {
          expect(
            getTablePopulation(
              {
                applies_to_squad: false,
                position_groups: [],
                positions: [],
                athletes: ['1234567'],
                all_squads: false,
                squads: [],
              },
              squadAthletes,
              squads,
              sortedPopulationIds
            )
          ).toEqual([{ id: '1234567', name: 'Test' }]);
        });
        it('returns All Squads and id when all_squads is true', () => {
          expect(
            getTablePopulation(
              {
                applies_to_squad: false,
                position_groups: [],
                positions: [],
                athletes: [],
                all_squads: true,
                squads: [],
              },
              squadAthletes,
              squads,
              sortedPopulationIds
            )
          ).toEqual([
            { id: 'all_squads', name: '#sport_specific__All_Squads' },
          ]);
        });
        it('returns the Squad and id when a squad is selected', () => {
          expect(
            getTablePopulation(
              {
                applies_to_squad: false,
                position_groups: [],
                positions: [],
                athletes: [],
                all_squads: false,
                squads: ['9876'],
              },
              squadAthletes,
              squads,
              sortedPopulationIds
            )
          ).toEqual([{ id: '9876', name: 'First Team' }]);
        });
      });

      describe('when sorting', () => {
        const sortedPopulationIds = ['999', 'entire_squad', '123'];

        it('returns in the correct order', () => {
          expect(
            getTablePopulation(
              {
                applies_to_squad: true,
                position_groups: ['123'],
                positions: ['999'],
                athletes: [],
                all_squads: false,
                squads: [],
              },
              squadAthletes,
              squads,
              sortedPopulationIds
            )
          ).toEqual([
            { id: '999', name: 'Left Back' },
            { id: 'entire_squad', name: 'Entire Squad' },
            { id: '123', name: 'Defenders' },
          ]);
        });
      });

      describe('when labels and groups are passed in', () => {
        it('returns the correct population label for a single label', () => {
          expect(
            getTablePopulation(
              {
                ...EMPTY_SELECTION,
                labels: [labelData[0].id],
              },
              squadAthletes,
              squads,
              [],
              labelData,
              segmentData
            )
          ).toEqual([{ id: labelData[0].id, name: labelData[0].name }]);
        });
        it('returns the correct population label for a multiple labels', () => {
          expect(
            getTablePopulation(
              {
                ...EMPTY_SELECTION,
                labels: [labelData[0].id, labelData[1].id],
              },
              squadAthletes,
              squads,
              [],
              labelData,
              segmentData
            )
          ).toEqual([
            { id: labelData[0].id, name: labelData[0].name },
            { id: labelData[1].id, name: labelData[1].name },
          ]);
        });

        it('returns the correct population label for a single segment', () => {
          expect(
            getTablePopulation(
              {
                ...EMPTY_SELECTION,
                segments: [segmentData[0].id],
              },
              squadAthletes,
              squads,
              [],
              labelData,
              segmentData
            )
          ).toEqual([{ id: segmentData[0].id, name: segmentData[0].name }]);
        });
        it('returns the correct population label for a multiple segments', () => {
          expect(
            getTablePopulation(
              {
                ...EMPTY_SELECTION,
                segments: [segmentData[0].id, segmentData[1].id],
              },
              squadAthletes,
              squads,
              [],
              labelData,
              segmentData
            )
          ).toEqual([
            { id: segmentData[0].id, name: segmentData[0].name },
            { id: segmentData[1].id, name: segmentData[1].name },
          ]);
        });

        it('returns correct label for complicated population', () => {
          expect(
            getTablePopulation(
              {
                ...EMPTY_SELECTION,
                position_groups: [squadAthletes.position_groups[0].id],
                squads: [squads[0].id],
                labels: [labelData[1].id],
                segments: [segmentData[0].id, segmentData[1].id],
              },
              squadAthletes,
              squads,
              [],
              labelData,
              segmentData
            )
          ).toEqual([
            {
              id: squadAthletes.position_groups[0].id,
              name: squadAthletes.position_groups[0].name,
            },
            {
              id: squads[0].id,
              name: squads[0].name,
            },
            { id: labelData[1].id, name: labelData[1].name },
            { id: segmentData[0].id, name: segmentData[0].name },
            { id: segmentData[1].id, name: segmentData[1].name },
          ]);
        });
      });
    });

    describe('getCalculationDropdownItems', () => {
      it('returns the correct values', () => {
        expect(getCalculationDropdownOptions()).toEqual([
          {
            id: 'sum_absolute',
            title: 'Sum (Absolute)',
          },
          {
            id: 'sum',
            title: 'Sum',
          },
          {
            id: 'min_absolute',
            title: 'Min (Absolute)',
          },
          {
            id: 'min',
            title: 'Min',
          },
          {
            id: 'max_absolute',
            title: 'Max (Absolute)',
          },
          {
            id: 'max',
            title: 'Max',
          },
          {
            id: 'mean',
            title: 'Mean',
          },
          {
            id: 'mean_absolute',
            title: 'Mean (Absolute)',
          },
          {
            id: 'count',
            title: 'Count',
          },
          {
            id: 'count_absolute',
            title: 'Count (Absolute)',
          },
          {
            id: 'last',
            title: 'Last',
          },
        ]);
      });

      describe('when the table-widget-complex-calculations is true', () => {
        beforeEach(() => {
          window.setFlag('table-widget-complex-calculations', true);
        });

        afterEach(() => {
          window.setFlag('table-widget-complex-calculations', false);
        });

        it('returns the complex calculations', () => {
          expect(
            getCalculationDropdownOptions({ withComplexCalcs: true })
          ).toEqual([
            {
              id: 'sum_absolute',
              title: 'Sum (Absolute)',
            },
            {
              id: 'sum',
              title: 'Sum',
            },
            {
              id: 'min_absolute',
              title: 'Min (Absolute)',
            },
            {
              id: 'min',
              title: 'Min',
            },
            {
              id: 'max_absolute',
              title: 'Max (Absolute)',
            },
            {
              id: 'max',
              title: 'Max',
            },
            {
              id: 'mean',
              title: 'Mean',
            },
            {
              id: 'mean_absolute',
              title: 'Mean (Absolute)',
            },
            {
              id: 'count',
              title: 'Count',
            },
            {
              id: 'count_absolute',
              title: 'Count (Absolute)',
            },
            {
              id: 'last',
              title: 'Last',
            },
            { id: 'z_score', title: 'Z-Score' },
            { id: 'complex_z_score', title: 'Complex Z-Score' },
            { id: 'acute_chronic', title: 'Acute:Chronic' },
            { id: 'acute_chronic_ewma', title: 'Acute:Chronic (EWMA)' },
            { id: 'training_stress_balance', title: 'Training Stress Balance' },
            {
              id: 'standard_deviation',
              title: 'Standard Deviation',
            },
            { id: 'strain', title: 'Strain' },
            { id: 'monotony', title: 'Monotony' },
            {
              id: 'average_percentage_change',
              title: 'Average Percentage Change',
            },
          ]);
        });

        it('returns the correct values if dataSourceType is TABLE_WIDGET_DATA_SOURCE_TYPES.maturityEstimate', () => {
          expect(
            getCalculationDropdownOptions({
              withComplexCalcs: true,
              dataSourceType: TABLE_WIDGET_DATA_SOURCE_TYPES.maturityEstimate,
            })
          ).toEqual([
            {
              id: 'min_absolute',
              title: 'Min (Absolute)',
            },
            {
              id: 'min',
              title: 'Min',
            },
            {
              id: 'max_absolute',
              title: 'Max (Absolute)',
            },
            {
              id: 'max',
              title: 'Max',
            },
            {
              id: 'mean',
              title: 'Mean',
            },
            {
              id: 'mean_absolute',
              title: 'Mean (Absolute)',
            },
            {
              id: 'count',
              title: 'Count',
            },
            {
              id: 'count_absolute',
              title: 'Count (Absolute)',
            },
            {
              id: 'last',
              title: 'Last',
            },
            {
              id: 'z_score',
              title: 'Z-Score',
            },
            {
              id: 'complex_z_score',
              title: 'Complex Z-Score',
            },
            {
              id: 'standard_deviation',
              title: 'Standard Deviation',
            },
          ]);
        });

        it('returns the correct values if dataSourceType is games', () => {
          expect(
            getCalculationDropdownOptions({
              withComplexCalcs: false,
              dataSourceType: DATA_SOURCES.games,
            })
          ).toEqual([
            {
              id: 'sum_absolute',
              title: 'Sum (Absolute)',
            },
            {
              id: 'sum',
              title: 'Sum',
            },
            {
              id: 'min',
              title: 'Min',
            },
            {
              id: 'max',
              title: 'Max',
            },
            {
              id: 'mean',
              title: 'Mean',
            },
            {
              id: 'count',
              title: 'Count',
            },
            {
              id: 'count_absolute',
              title: 'Count (Absolute)',
            },
            {
              id: 'last',
              title: 'Last',
            },
          ]);
        });
      });
    });

    describe('getCalculationTitle', () => {
      it('returns the correct title for id', () => {
        expect(getCalculationTitle('sum_absolute')).toEqual('Sum (Absolute)');
        expect(getCalculationTitle('sum')).toEqual('Sum');
        expect(getCalculationTitle('min_absolute')).toEqual('Min (Absolute)');
        expect(getCalculationTitle('min')).toEqual('Min');
        expect(getCalculationTitle('max_absolute')).toEqual('Max (Absolute)');
        expect(getCalculationTitle('max')).toEqual('Max');
        expect(getCalculationTitle('mean')).toEqual('Mean');
        expect(getCalculationTitle('mean_absolute')).toEqual('Mean (Absolute)');
        expect(getCalculationTitle('count')).toEqual('Count');
        expect(getCalculationTitle('last')).toEqual('Last');
      });
    });

    describe('getSummaryName', () => {
      it('returns the correct name for id', () => {
        expect(getSummaryName('mean')).toEqual('Mean');
        expect(getSummaryName('min')).toEqual('Min');
        expect(getSummaryName('max')).toEqual('Max');
        expect(getSummaryName('sum')).toEqual('Sum');
        expect(getSummaryName('filled')).toEqual('Filled');
        expect(getSummaryName('empty')).toEqual('Empty');
        expect(getSummaryName('percentageFilled')).toEqual('% Filled');
        expect(getSummaryName('percentageEmpty')).toEqual('% Empty');
        expect(getSummaryName('range')).toEqual('Range');
        expect(getSummaryName('median')).toEqual('Median');
        expect(getSummaryName('standardDeviation')).toEqual('SD');
        expect(getSummaryName()).toEqual('Mean');
      });
    });

    describe('getSummaryValue', () => {
      describe('when there is no column data', () => {
        const data = [];
        it('returns the correct value when Mean is selected', () => {
          expect(getSummaryValue('mean', data)).toEqual(0);
        });
        it('returns the correct value when Min is selected', () => {
          expect(getSummaryValue('min', data)).toEqual('');
        });
        it('returns the correct value when Max is selected', () => {
          expect(getSummaryValue('max', data)).toEqual('');
        });
        it('returns the correct value when Sum is selected', () => {
          expect(getSummaryValue('sum', data)).toEqual(0);
        });
        it('returns the correct value when Filled is selected', () => {
          expect(getSummaryValue('filled', data)).toEqual(0);
        });
        it('returns the correct value when Empty is selected', () => {
          expect(getSummaryValue('empty', data)).toEqual(0);
        });
        it('returns the correct value when % Filled is selected', () => {
          expect(getSummaryValue('percentageFilled', data)).toEqual('0%');
        });
        it('returns the correct value when % Empty is selected', () => {
          expect(getSummaryValue('percentageEmpty', data)).toEqual('0%');
        });
        it('returns the correct value when Range is selected', () => {
          expect(getSummaryValue('range', data)).toEqual('');
        });
        it('returns the correct value when Median is selected', () => {
          expect(getSummaryValue('median', data)).toEqual('');
        });
        it('returns the correct value when Standard Deviation is selected', () => {
          expect(getSummaryValue('standardDeviation', data)).toEqual('');
        });
        it('returns the correct value when nothing is selected', () => {
          expect(getSummaryValue('', data)).toEqual(0);
        });
      });

      describe('when there is column data and 3 population selected', () => {
        const data = [354.95, 3222.5, 218.12];
        it('returns the correct value when Mean is selected', () => {
          expect(getSummaryValue('mean', data)).toEqual('1265.19');
        });
        it('returns the correct value when Min is selected', () => {
          expect(getSummaryValue('min', data)).toEqual('218.12');
        });
        it('returns the correct value when Max is selected', () => {
          expect(getSummaryValue('max', data)).toEqual('3222.50');
        });
        it('returns the correct value when Sum is selected', () => {
          expect(getSummaryValue('sum', data)).toEqual('3795.57');
        });
        it('returns the correct value when Filled is selected', () => {
          expect(getSummaryValue('filled', data)).toEqual(3);
        });
        it('returns the correct value when Empty is selected', () => {
          expect(getSummaryValue('empty', data)).toEqual(0);
        });
        it('returns the correct value when % Filled is selected', () => {
          expect(getSummaryValue('percentageFilled', data)).toEqual('100%');
        });
        it('returns the correct value when % Empty is selected', () => {
          expect(getSummaryValue('percentageEmpty', data)).toEqual('0%');
        });
        it('returns the correct value when Range is selected', () => {
          expect(getSummaryValue('range', data)).toEqual('218.12 - 3222.50');
        });
        it('returns the correct value when Median is selected', () => {
          expect(getSummaryValue('median', data)).toEqual('354.95');
        });
        it('returns the correct value when Standard Deviation is selected', () => {
          expect(getSummaryValue('standardDeviation', data)).toEqual('1385.15');
        });
        it('returns the correct value when nothing is selected', () => {
          expect(getSummaryValue('', data)).toEqual('1265.19');
        });
      });

      describe('when there is a percentage calcuation with object values', () => {
        const data = [
          { numerator: 5, denominator: 10 },
          { numerator: 2, denominator: 10 },
          { numerator: 3, denominator: 6 },
        ];

        it('returns the correct value when Mean is selected', () => {
          expect(getSummaryValue('mean', data, 'percentage')).toEqual('40%');
        });
        it('returns the correct value when Min is selected', () => {
          expect(getSummaryValue('min', data, 'percentage')).toEqual('20%');
        });
        it('returns the correct value when Max is selected', () => {
          expect(getSummaryValue('max', data, 'percentage')).toEqual('50%');
        });
        it('returns the correct value when Sum is selected', () => {
          expect(getSummaryValue('sum', data, 'percentage')).toEqual('120%');
        });
        it('returns the correct value when Filled is selected', () => {
          expect(getSummaryValue('filled', data, 'percentage')).toEqual(3);
        });
        it('returns the correct value when Empty is selected', () => {
          expect(getSummaryValue('empty', data, 'percentage')).toEqual(0);
        });
        it('returns the correct value when % Filled is selected', () => {
          expect(
            getSummaryValue('percentageFilled', data, 'percentage')
          ).toEqual('100%');
        });
        it('returns the correct value when % Empty is selected', () => {
          expect(
            getSummaryValue('percentageEmpty', data, 'percentage')
          ).toEqual('0%');
        });
        it('returns the correct value when Range is selected', () => {
          expect(getSummaryValue('range', data, 'percentage')).toEqual(
            '20% - 50%'
          );
        });
        it('returns the correct value when Median is selected', () => {
          expect(getSummaryValue('median', data, 'percentage')).toEqual('50%');
        });
        it('returns the correct value when Standard Deviation is selected', () => {
          expect(
            getSummaryValue('standardDeviation', data, 'percentage')
          ).toEqual('14.14%');
        });
        it('returns the correct value when nothing is selected', () => {
          expect(getSummaryValue('', data, 'percentage')).toEqual('40%');
        });
      });

      describe('when there is a proportion calculation', () => {
        const data = [
          { numerator: 5, denominator: 10 },
          { numerator: 2, denominator: 10 },
          { numerator: 3, denominator: 6 },
        ];

        it('returns the correct value when Mean is selected', () => {
          expect(getSummaryValue('mean', data, 'proportion')).toEqual(
            '3.33 / 8.67'
          );
        });
        it('returns the correct value when Min is selected', () => {
          expect(getSummaryValue('min', data, 'proportion')).toEqual('2 / 6');
        });
        it('returns the correct value when Max is selected', () => {
          expect(getSummaryValue('max', data, 'proportion')).toEqual('5 / 10');
        });
        it('returns the correct value when Sum is selected', () => {
          expect(getSummaryValue('sum', data, 'proportion')).toEqual('10 / 26');
        });
        it('returns the correct value when Filled is selected', () => {
          expect(getSummaryValue('filled', data, 'proportion')).toEqual(3);
        });
        it('returns the correct value when Empty is selected', () => {
          expect(getSummaryValue('empty', data, 'proportion')).toEqual(0);
        });
        it('returns the correct value when % Filled is selected', () => {
          expect(
            getSummaryValue('percentageFilled', data, 'proportion')
          ).toEqual('100%');
        });
        it('returns the correct value when % Empty is selected', () => {
          expect(
            getSummaryValue('percentageEmpty', data, 'proportion')
          ).toEqual('0%');
        });
        it('returns the correct value when Range is selected', () => {
          expect(getSummaryValue('range', data, 'proportion')).toEqual(
            '2 - 5 / 6 - 10'
          );
        });
        it('returns the correct value when Median is selected', () => {
          expect(getSummaryValue('median', data, 'proportion')).toEqual(
            '3 / 10'
          );
        });
        it('returns the correct value when Standard Deviation is selected', () => {
          expect(
            getSummaryValue('standardDeviation', data, 'proportion')
          ).toEqual('1.25 / 1.89');
        });
        it('returns the correct value when nothing is selected', () => {
          expect(getSummaryValue('', data, 'proportion')).toEqual(
            '3.33 / 8.67'
          );
        });
      });
    });

    describe('shouldFormatCell', () => {
      it('returns false if cellValue is null', () => {
        expect(
          shouldFormatCell(null, {
            type: 'numeric',
            condition: 'less_than',
            value: 9,
            color: colors.blue_100,
          })
        ).toEqual(false);
      });

      it('returns true if condition is less_than and the cellValue is < the rule value', () => {
        expect(
          shouldFormatCell(3, {
            type: 'numeric',
            condition: 'less_than',
            value: 9,
            color: colors.blue_100,
          })
        ).toEqual(true);
      });

      it('returns false if condition is less_than and the cellValue is not < the rule value', () => {
        expect(
          shouldFormatCell(14, {
            type: 'numeric',
            condition: 'less_than',
            value: 9,
            color: colors.blue_100,
          })
        ).toEqual(false);
      });

      it('returns true if condition is greater_than and the cellValue is > the rule value', () => {
        expect(
          shouldFormatCell(14, {
            type: 'numeric',
            condition: 'greater_than',
            value: 9,
            color: colors.blue_100,
          })
        ).toEqual(true);
      });

      it('returns false if condition is greater_than and the cellValue is not > the rule value', () => {
        expect(
          shouldFormatCell(2, {
            type: 'numeric',
            condition: 'greater_than',
            value: 9,
            color: colors.blue_100,
          })
        ).toEqual(false);
      });

      it('returns true if condition is equal_to and the cellValue is equal to the rule value', () => {
        expect(
          shouldFormatCell(9, {
            type: 'numeric',
            condition: 'equal_to',
            value: 9,
            color: colors.blue_100,
          })
        ).toEqual(true);
      });

      it('returns false if condition is equal_to and the cellValue is not equal to the rule value', () => {
        expect(
          shouldFormatCell(92, {
            type: 'numeric',
            condition: 'equal_to',
            value: 9,
            color: colors.blue_100,
          })
        ).toEqual(false);
      });

      it('returns true if condition is not_equal_to and the cellValue is an availability status without a matching value', () => {
        expect(
          shouldFormatCell(
            {
              status: 'medical_attention',
            },
            {
              type: 'string',
              condition: 'not_equal_to',
              value: 'Available',
              color: colors.blue_100,
            }
          )
        ).toEqual(true);
      });

      it('returns true if condition is greater_than and the cellValue is a proportional value and its numerator is greater than cellValue', () => {
        expect(
          shouldFormatCell(
            {
              numerator: 5,
              denominator: 10,
            },
            {
              type: 'numeric',
              condition: 'greater_than',
              value: 4,
              color: colors.blue_100,
            },
            'proportion'
          )
        ).toEqual(true);
      });

      it('returns true if condition is greater_than and the cellValue is a proportional value, the calculation is percentage, and the percent is greater than the numeric value', () => {
        expect(
          shouldFormatCell(
            {
              numerator: 5,
              denominator: 10,
            },
            {
              type: 'numeric',
              condition: 'greater_than',
              value: 40,
              color: colors.blue_100,
            },
            'percentage'
          )
        ).toEqual(true);
      });
    });

    describe('getCellData', () => {
      const columnData = [
        { id: '1', value: 34 },
        { id: '2', value: 12345 },
        { id: '3', value: 4 },
        { id: '4', value: 32 },
        { id: '5', value: 12, children: [{ id: 'test-label', value: 12 }] },
        {
          id: '6',
          value: 12,
          children: [{ id: NOT_AVAILABLE.label, value: 12 }],
        },
        { id: '8', value: 0, children: [{ id: 'test-label', value: 0 }] },
        { id: '9', value: null, children: [{ id: 'test-label', value: null }] },
      ];
      it('returns null if columnData length is 0', () => {
        expect(getCellDetails([], 1)).toEqual({ id: 1, value: null });
      });

      it('returns null if item id is not found in columnData', () => {
        expect(getCellDetails(columnData, 13)).toEqual({
          id: 13,
          value: null,
        });
      });

      it('returns the item value if item is found in columnData', () => {
        expect(getCellDetails(columnData, 3)).toEqual({ id: '3', value: 4 });
      });

      it('returns the expected object when "rowData" is present', () => {
        expect(
          getCellDetails(columnData, 5, {
            isDynamic: true,
            label: 'test-label',
          })
        ).toEqual({ id: 'test-label', value: 12 });
      });

      it('returns the expected object when "rowData" is present and label is undefined', () => {
        expect(
          getCellDetails(columnData, 3, {
            isDynamic: true,
          })
        ).toEqual({
          id: 3,
          value: null,
        });
      });

      it('returns the expected object when "rowData" is present and value is null', () => {
        expect(
          getCellDetails(columnData, 9, {
            isDynamic: true,
            label: 'test-label',
          })
        ).toEqual({
          id: 'test-label',
          value: DASH,
        });
      });

      it('returns the expected object when "rowData" is present and value is 0', () => {
        expect(
          getCellDetails(columnData, 8, {
            isDynamic: true,
            label: 'test-label',
          })
        ).toEqual({
          id: 'test-label',
          value: 0,
        });
      });

      it('returns the expected object when id is "not_available"', () => {
        expect(
          getCellDetails(columnData, 6, {
            isDynamic: true,
            label: NOT_AVAILABLE.label,
          })
        ).toEqual({
          id: NOT_AVAILABLE.label,
          value: NOT_AVAILABLE.value,
        });
      });
    });

    describe('getCellColour', () => {
      const rules = [
        {
          type: 'numeric',
          condition: 'equal_to',
          value: 9,
          color: colors.blue_100,
        },
        {
          type: 'numeric',
          condition: 'greater_than',
          value: 359,
          color: colors.blue_100,
        },
        {
          type: 'numeric',
          condition: 'equal_to',
          value: 19,
          color: colors.grey_100,
        },
      ];

      it('returns color white if there is no cellValue', () => {
        expect(getCellColour(rules, null)).toEqual({
          background: colors.white,
        });
      });

      it('returns color white if rules length is 0', () => {
        expect(getCellColour([], 9)).toEqual({ background: colors.white });
      });

      it('returns the correct colour for the cell', () => {
        expect(getCellColour(rules, 9)).toEqual({
          background: colors.blue_100,
        });
      });

      it('returns the correct color for customColor', () => {
        expect(getCellColour([], 9, null, colors.neutral_100)).toEqual({
          background: colors.neutral_100,
        });
      });

      it('returns the correct color for customColor with rules', () => {
        expect(getCellColour(rules, 9, null, colors.neutral_100)).toEqual({
          background: colors.blue_100,
        });
      });
    });

    describe('getRankingCalculation()', () => {
      const testCase1 = [9.3, 8.9, 8.5, 8.2, 8.2, 8.2, 7.8, 7.6, 6.5];
      const testCase2 = [114.5, 89.4, 76.3, 64.2, 64.2, 32.6, 12.7, 5.2, 1.7];
      const testCase3 = [
        15782.4, 2385.7, 2385.7, 392.8, 28.9, -3.4, -3.4, -146.8, -3578.2,
      ];
      const testCase4 = [
        { numerator: 9.3, denominator: 10 },
        { numerator: 8.9, denominator: 10 },
        { numerator: 8.5, denominator: 10 },
        { numerator: 8.2, denominator: 10 },
        { numerator: 8.2, denominator: 10 },
        { numerator: 8.2, denominator: 10 },
        { numerator: 7.8, denominator: 10 },
        { numerator: 7.6, denominator: 10 },
        { numerator: 6.5, denominator: 10 },
      ];

      it('returns values when calculation is NONE', () => {
        const rankedTestCase1 = testCase1.map((value) =>
          getRankingCalculation(value, testCase1, 'NONE')
        );

        expect(rankedTestCase1).toEqual(testCase1);
      });

      it('returns values when calculation is RANK and direction is HIGH_LOW', () => {
        const rankedValuesTestCase1 = testCase1.map((value) =>
          getRankingCalculation(value, testCase1, 'RANK', 'HIGH_LOW')
        );
        const rankedValuesTestCase2 = testCase2.map((value) =>
          getRankingCalculation(value, testCase2, 'RANK', 'HIGH_LOW')
        );
        const rankedValuesTestCase3 = testCase3.map((value) =>
          getRankingCalculation(value, testCase3, 'RANK', 'HIGH_LOW')
        );
        const rankedValuesTestCase4 = testCase4.map((value) =>
          getRankingCalculation(value, testCase4, 'RANK', 'HIGH_LOW')
        );
        const rankedValuesTestCase4Percentage = testCase4.map((value) =>
          getRankingCalculation(
            value,
            testCase4,
            'RANK',
            'HIGH_LOW',
            'percentage'
          )
        );

        expect(rankedValuesTestCase1).toEqual([1, 2, 3, 4, 4, 4, 7, 8, 9]);
        expect(rankedValuesTestCase2).toEqual([1, 2, 3, 4, 4, 6, 7, 8, 9]);
        expect(rankedValuesTestCase3).toEqual([1, 2, 2, 4, 5, 6, 6, 8, 9]);
        expect(rankedValuesTestCase4).toEqual([1, 2, 3, 4, 4, 4, 7, 8, 9]);
        expect(rankedValuesTestCase4Percentage).toEqual([
          1, 2, 3, 4, 4, 4, 7, 8, 9,
        ]);
      });

      it('returns values when calculation is RANK and direction is LOW_HIGH', () => {
        const rankedValuesTestCase1 = testCase1.map((value) =>
          getRankingCalculation(value, testCase1, 'RANK', 'LOW_HIGH')
        );
        const rankedValuesTestCase2 = testCase2.map((value) =>
          getRankingCalculation(value, testCase2, 'RANK', 'LOW_HIGH')
        );
        const rankedValuesTestCase3 = testCase3.map((value) =>
          getRankingCalculation(value, testCase3, 'RANK', 'LOW_HIGH')
        );
        const rankedValuesTestCase4 = testCase4.map((value) =>
          getRankingCalculation(value, testCase4, 'RANK', 'LOW_HIGH')
        );
        const rankedValuesTestCase4Percentage = testCase4.map((value) =>
          getRankingCalculation(
            value,
            testCase4,
            'RANK',
            'LOW_HIGH',
            'percentage'
          )
        );

        expect(rankedValuesTestCase1).toEqual([9, 8, 7, 4, 4, 4, 3, 2, 1]);
        expect(rankedValuesTestCase2).toEqual([9, 8, 7, 5, 5, 4, 3, 2, 1]);
        expect(rankedValuesTestCase3).toEqual([9, 7, 7, 6, 5, 3, 3, 2, 1]);
        expect(rankedValuesTestCase4).toEqual([9, 8, 7, 4, 4, 4, 3, 2, 1]);
        expect(rankedValuesTestCase4Percentage).toEqual([
          9, 8, 7, 4, 4, 4, 3, 2, 1,
        ]);
      });

      it('returns values when calculation is SPLIT_RANK and direction is HIGH_LOW', () => {
        const rankedValuesTestCase1 = testCase1.map((value) =>
          getRankingCalculation(value, testCase1, 'SPLIT_RANK', 'HIGH_LOW')
        );
        const rankedValuesTestCase2 = testCase2.map((value) =>
          getRankingCalculation(value, testCase2, 'SPLIT_RANK', 'HIGH_LOW')
        );
        const rankedValuesTestCase3 = testCase3.map((value) =>
          getRankingCalculation(value, testCase3, 'SPLIT_RANK', 'HIGH_LOW')
        );
        const rankedValuesTestCase4 = testCase4.map((value) =>
          getRankingCalculation(value, testCase4, 'SPLIT_RANK', 'HIGH_LOW')
        );
        const rankedValuesTestCase4Percentage = testCase4.map((value) =>
          getRankingCalculation(
            value,
            testCase4,
            'SPLIT_RANK',
            'HIGH_LOW',
            'percentage'
          )
        );

        expect(rankedValuesTestCase1).toEqual([1, 2, 3, 5, 5, 5, 7, 8, 9]);
        expect(rankedValuesTestCase2).toEqual([1, 2, 3, 4.5, 4.5, 6, 7, 8, 9]);
        expect(rankedValuesTestCase3).toEqual([
          1, 2.5, 2.5, 4, 5, 6.5, 6.5, 8, 9,
        ]);
        expect(rankedValuesTestCase4).toEqual([1, 2, 3, 5, 5, 5, 7, 8, 9]);
        expect(rankedValuesTestCase4Percentage).toEqual([
          1, 2, 3, 5, 5, 5, 7, 8, 9,
        ]);
      });

      it('returns values when calculation is SPLIT_RANK and direction is LOW_HIGH', () => {
        const rankedValuesTestCase1 = testCase1.map((value) =>
          getRankingCalculation(value, testCase1, 'SPLIT_RANK', 'LOW_HIGH')
        );
        const rankedValuesTestCase2 = testCase2.map((value) =>
          getRankingCalculation(value, testCase2, 'SPLIT_RANK', 'LOW_HIGH')
        );
        const rankedValuesTestCase3 = testCase3.map((value) =>
          getRankingCalculation(value, testCase3, 'SPLIT_RANK', 'LOW_HIGH')
        );
        const rankedValuesTestCase4 = testCase4.map((value) =>
          getRankingCalculation(value, testCase4, 'SPLIT_RANK', 'LOW_HIGH')
        );
        const rankedValuesTestCase4Percentage = testCase4.map((value) =>
          getRankingCalculation(
            value,
            testCase4,
            'SPLIT_RANK',
            'LOW_HIGH',
            'percentage'
          )
        );

        expect(rankedValuesTestCase1).toEqual([9, 8, 7, 5, 5, 5, 3, 2, 1]);
        expect(rankedValuesTestCase2).toEqual([9, 8, 7, 5.5, 5.5, 4, 3, 2, 1]);
        expect(rankedValuesTestCase3).toEqual([
          9, 7.5, 7.5, 6, 5, 3.5, 3.5, 2, 1,
        ]);
        expect(rankedValuesTestCase4).toEqual([9, 8, 7, 5, 5, 5, 3, 2, 1]);
        expect(rankedValuesTestCase4Percentage).toEqual([
          9, 8, 7, 5, 5, 5, 3, 2, 1,
        ]);
      });

      it('returns values when calculation is PERCENTILE and direction is HIGH_LOW', () => {
        const rankedValuesTestCase1 = testCase1.map((value) =>
          getRankingCalculation(value, testCase1, 'PERCENTILE', 'HIGH_LOW')
        );
        const rankedValuesTestCase2 = testCase2.map((value) =>
          getRankingCalculation(value, testCase2, 'PERCENTILE', 'HIGH_LOW')
        );
        const rankedValuesTestCase3 = testCase3.map((value) =>
          getRankingCalculation(value, testCase3, 'PERCENTILE', 'HIGH_LOW')
        );
        const rankedValuesTestCase4 = testCase4.map((value) =>
          getRankingCalculation(value, testCase4, 'PERCENTILE', 'HIGH_LOW')
        );
        const rankedValuesTestCase4Percentage = testCase4.map((value) =>
          getRankingCalculation(
            value,
            testCase4,
            'PERCENTILE',
            'HIGH_LOW',
            'percentage'
          )
        );

        expect(rankedValuesTestCase1).toEqual([
          1.0, 0.88, 0.75, 0.38, 0.38, 0.38, 0.25, 0.13, 0.0,
        ]);
        expect(rankedValuesTestCase2).toEqual([
          1.0, 0.88, 0.75, 0.5, 0.5, 0.38, 0.25, 0.13, 0.0,
        ]);
        expect(rankedValuesTestCase3).toEqual([
          1.0, 0.75, 0.75, 0.63, 0.5, 0.25, 0.25, 0.13, 0.0,
        ]);
        expect(rankedValuesTestCase4).toEqual([
          1.0, 0.88, 0.75, 0.38, 0.38, 0.38, 0.25, 0.13, 0.0,
        ]);
        expect(rankedValuesTestCase4Percentage).toEqual([
          1.0, 0.88, 0.75, 0.38, 0.38, 0.38, 0.25, 0.13, 0.0,
        ]);
      });

      it('returns values when calculation is PERCENTILE and direction is LOW_HIGH', () => {
        const rankedValuesTestCase1 = testCase1.map((value) =>
          getRankingCalculation(value, testCase1, 'PERCENTILE', 'LOW_HIGH')
        );
        const rankedValuesTestCase2 = testCase2.map((value) =>
          getRankingCalculation(value, testCase2, 'PERCENTILE', 'LOW_HIGH')
        );
        const rankedValuesTestCase3 = testCase3.map((value) =>
          getRankingCalculation(value, testCase3, 'PERCENTILE', 'LOW_HIGH')
        );
        const rankedValuesTestCase4 = testCase4.map((value) =>
          getRankingCalculation(value, testCase4, 'PERCENTILE', 'LOW_HIGH')
        );
        const rankedValuesTestCase4Percentage = testCase4.map((value) =>
          getRankingCalculation(
            value,
            testCase4,
            'PERCENTILE',
            'LOW_HIGH',
            'percentage'
          )
        );

        expect(rankedValuesTestCase1).toEqual([
          0.0, 0.13, 0.25, 0.63, 0.63, 0.63, 0.75, 0.88, 1.0,
        ]);
        expect(rankedValuesTestCase2).toEqual([
          0.0, 0.13, 0.25, 0.5, 0.5, 0.63, 0.75, 0.88, 1.0,
        ]);
        expect(rankedValuesTestCase3).toEqual([
          0.0, 0.25, 0.25, 0.38, 0.5, 0.75, 0.75, 0.88, 1.0,
        ]);
        expect(rankedValuesTestCase4).toEqual([
          0.0, 0.13, 0.25, 0.63, 0.63, 0.63, 0.75, 0.88, 1.0,
        ]);
        expect(rankedValuesTestCase4Percentage).toEqual([
          0.0, 0.13, 0.25, 0.63, 0.63, 0.63, 0.75, 0.88, 1.0,
        ]);
      });

      it('returns values when calculation is QUARTILE and direction is LOW_HIGH', () => {
        const rankedValuesTestCase1 = testCase1.map((value) =>
          getRankingCalculation(value, testCase1, 'QUARTILE', 'LOW_HIGH')
        );
        const rankedValuesTestCase2 = testCase2.map((value) =>
          getRankingCalculation(value, testCase2, 'QUARTILE', 'LOW_HIGH')
        );
        const rankedValuesTestCase3 = testCase3.map((value) =>
          getRankingCalculation(value, testCase3, 'QUARTILE', 'LOW_HIGH')
        );
        const rankedValuesTestCase4 = testCase4.map((value) =>
          getRankingCalculation(value, testCase4, 'QUARTILE', 'LOW_HIGH')
        );
        const rankedValuesTestCase4Percentage = testCase4.map((value) =>
          getRankingCalculation(
            value,
            testCase4,
            'QUARTILE',
            'LOW_HIGH',
            'percentage'
          )
        );

        expect(rankedValuesTestCase1).toEqual([4, 4, 4, 2, 2, 2, 2, 1, 1]);
        expect(rankedValuesTestCase2).toEqual([4, 4, 4, 3, 3, 2, 2, 1, 1]);
        expect(rankedValuesTestCase3).toEqual([4, 4, 4, 3, 3, 2, 2, 1, 1]);
        expect(rankedValuesTestCase4).toEqual([4, 4, 4, 2, 2, 2, 2, 1, 1]);
        expect(rankedValuesTestCase4Percentage).toEqual([
          4, 4, 4, 2, 2, 2, 2, 1, 1,
        ]);
      });

      it('returns values when calculation is QUARTILE and direction is HIGH_LOW', () => {
        const rankedValuesTestCase1 = testCase1.map((value) =>
          getRankingCalculation(value, testCase1, 'QUARTILE', 'HIGH_LOW')
        );
        const rankedValuesTestCase2 = testCase2.map((value) =>
          getRankingCalculation(value, testCase2, 'QUARTILE', 'HIGH_LOW')
        );
        const rankedValuesTestCase3 = testCase3.map((value) =>
          getRankingCalculation(value, testCase3, 'QUARTILE', 'HIGH_LOW')
        );
        const rankedValuesTestCase4 = testCase4.map((value) =>
          getRankingCalculation(value, testCase4, 'QUARTILE', 'HIGH_LOW')
        );
        const rankedValuesTestCase4Percentage = testCase4.map((value) =>
          getRankingCalculation(
            value,
            testCase4,
            'QUARTILE',
            'HIGH_LOW',
            'percentage'
          )
        );

        expect(rankedValuesTestCase1).toEqual([1, 1, 2, 3, 3, 3, 4, 4, 4]);
        expect(rankedValuesTestCase2).toEqual([1, 1, 2, 3, 3, 3, 4, 4, 4]);
        expect(rankedValuesTestCase3).toEqual([1, 2, 2, 2, 3, 4, 4, 4, 4]);
        expect(rankedValuesTestCase4).toEqual([1, 1, 2, 3, 3, 3, 4, 4, 4]);
        expect(rankedValuesTestCase4Percentage).toEqual([
          1, 1, 2, 3, 3, 3, 4, 4, 4,
        ]);
      });

      it('returns values when calculation is QUINTILE and direction is LOW_HIGH', () => {
        const rankedValuesTestCase1 = testCase1.map((value) =>
          getRankingCalculation(value, testCase1, 'QUINTILE', 'LOW_HIGH')
        );
        const rankedValuesTestCase2 = testCase2.map((value) =>
          getRankingCalculation(value, testCase2, 'QUINTILE', 'LOW_HIGH')
        );
        const rankedValuesTestCase3 = testCase3.map((value) =>
          getRankingCalculation(value, testCase3, 'QUINTILE', 'LOW_HIGH')
        );
        const rankedValuesTestCase4 = testCase4.map((value) =>
          getRankingCalculation(value, testCase4, 'QUINTILE', 'LOW_HIGH')
        );
        const rankedValuesTestCase4Percentage = testCase4.map((value) =>
          getRankingCalculation(
            value,
            testCase4,
            'QUINTILE',
            'LOW_HIGH',
            'percentage'
          )
        );

        expect(rankedValuesTestCase1).toEqual([5, 5, 4, 2, 2, 2, 2, 1, 1]);
        expect(rankedValuesTestCase2).toEqual([5, 5, 4, 3, 3, 2, 2, 1, 1]);
        expect(rankedValuesTestCase3).toEqual([5, 4, 4, 4, 3, 2, 2, 1, 1]);
        expect(rankedValuesTestCase4).toEqual([5, 5, 4, 2, 2, 2, 2, 1, 1]);
        expect(rankedValuesTestCase4Percentage).toEqual([
          5, 5, 4, 2, 2, 2, 2, 1, 1,
        ]);
      });

      it('returns values when calculation is QUINTILE and direction is HIGH_LOW', () => {
        const rankedValuesTestCase1 = testCase1.map((value) =>
          getRankingCalculation(value, testCase1, 'QUINTILE', 'HIGH_LOW')
        );
        const rankedValuesTestCase2 = testCase2.map((value) =>
          getRankingCalculation(value, testCase2, 'QUINTILE', 'HIGH_LOW')
        );
        const rankedValuesTestCase3 = testCase3.map((value) =>
          getRankingCalculation(value, testCase3, 'QUINTILE', 'HIGH_LOW')
        );
        const rankedValuesTestCase4 = testCase4.map((value) =>
          getRankingCalculation(value, testCase4, 'QUINTILE', 'HIGH_LOW')
        );
        const rankedValuesTestCase4Percentage = testCase4.map((value) =>
          getRankingCalculation(
            value,
            testCase4,
            'QUINTILE',
            'HIGH_LOW',
            'percentage'
          )
        );

        expect(rankedValuesTestCase1).toEqual([1, 1, 2, 4, 4, 4, 4, 5, 5]);
        expect(rankedValuesTestCase2).toEqual([1, 1, 2, 3, 3, 4, 4, 5, 5]);
        expect(rankedValuesTestCase3).toEqual([1, 2, 2, 2, 3, 4, 4, 5, 5]);
        expect(rankedValuesTestCase4).toEqual([1, 1, 2, 4, 4, 4, 4, 5, 5]);
        expect(rankedValuesTestCase4Percentage).toEqual([
          1, 1, 2, 4, 4, 4, 4, 5, 5,
        ]);
      });
    });

    describe('getFormattedCellValue()', () => {
      it('returns the correct cell value for a numeric input', () => {
        expect(getFormattedCellValue(246)).toEqual('246');
      });

      it('returns null value when null', () => {
        expect(getFormattedCellValue(null)).toEqual('');
      });

      it('returns value when string', () => {
        expect(getFormattedCellValue('234.56')).toEqual('234.56');
      });

      it('returns the correct cell value for status', () => {
        expect(getFormattedCellValue({ status: 'Available' })).toEqual(
          'Available'
        );
        expect(getFormattedCellValue({ status: 'Unavailable' })).toEqual(
          'Unavailable'
        );
      });

      it('returns the correct cell value for a proportional value is returned', () => {
        expect(
          getFormattedCellValue({
            numerator: 2,
            denominator: 5,
          })
        ).toEqual('2 / 5');
        expect(
          getFormattedCellValue({
            numerator: 0,
            denominator: 5,
          })
        ).toEqual('0 / 5');
      });

      it('returns the correct cell value for a percentage value when given percentage calculation', () => {
        expect(
          getFormattedCellValue(
            {
              numerator: 5,
              denominator: 10,
            },
            'percentage'
          )
        ).toEqual('50%');
        expect(
          getFormattedCellValue(
            {
              numerator: 0,
              denominator: 5,
            },
            'percentage'
          )
        ).toEqual('0%');
        expect(
          getFormattedCellValue(
            {
              numerator: 3,
              denominator: 9,
            },
            'percentage'
          )
        ).toEqual('33.33%');
      });

      it('returns the correct cell value for a percentage value when given percentage_duration calculation', () => {
        expect(
          getFormattedCellValue(
            {
              numerator: 5,
              denominator: 10,
            },
            'percentage_duration'
          )
        ).toEqual('50%');
        expect(
          getFormattedCellValue(
            {
              numerator: 0,
              denominator: 5,
            },
            'percentage_duration'
          )
        ).toEqual('0%');
        expect(
          getFormattedCellValue(
            {
              numerator: 3,
              denominator: 9,
            },
            'percentage_duration'
          )
        ).toEqual('33.33%');
      });

      it('returns the correct cell value for a count value when given count calculation', () => {
        expect(
          getFormattedCellValue(
            {
              numerator: 5,
              denominator: 10,
            },
            'count'
          )
        ).toEqual('5');
        expect(
          getFormattedCellValue(
            {
              numerator: 0,
              denominator: 5,
            },
            'count'
          )
        ).toEqual('0');
        expect(
          getFormattedCellValue(
            {
              numerator: 3,
              denominator: 9,
            },
            'count'
          )
        ).toEqual('3');
      });
    });

    describe('getPopulationSelectedItems', () => {
      it('returns empty for null squad', () => {
        expect(
          getPopulationSelectedItems({
            allSquadAthletes: SQUAD_ATHLETES_DATA.squads,
            groups: GROUPS_DATA,
            labels: LABELS_DATA,
            population: null,
            squads: [],
          })
        ).toEqual([]);
      });

      it('returns selected athletes', () => {
        expect(
          getPopulationSelectedItems({
            allSquadAthletes: SQUAD_ATHLETES_DATA.squads,
            groups: GROUPS_DATA,
            labels: LABELS_DATA,
            population: mergeWithEmptySelection({
              athletes: [2],
            }),
            squads: [],
          })
        ).toEqual(['Athlete Two']);
      });

      it('returns selected position_groups', () => {
        expect(
          getPopulationSelectedItems({
            allSquadAthletes: SQUAD_ATHLETES_DATA.squads,
            groups: GROUPS_DATA,
            labels: LABELS_DATA,
            population: mergeWithEmptySelection({
              position_groups: [25, 26],
            }),
            squads: [],
          })
        ).toEqual(['Forward', 'Backward']);
      });

      it('returns selected athletes accross squads', () => {
        expect(
          getPopulationSelectedItems({
            allSquadAthletes: SQUAD_ATHLETES_DATA.squads,
            groups: GROUPS_DATA,
            labels: LABELS_DATA,
            population: mergeWithEmptySelection({
              athletes: [2, 3],
            }),
            squads: [],
          })
        ).toEqual(['Athlete Two', 'Athlete Three']);
      });

      it('returns selected labels', () => {
        expect(
          getPopulationSelectedItems({
            allSquadAthletes: SQUAD_ATHLETES_DATA.squads,
            groups: GROUPS_DATA,
            labels: LABELS_DATA,
            population: mergeWithEmptySelection({
              labels: [1, 3],
            }),
            squads: [],
          })
        ).toEqual(['Label One', 'Label Three']);
      });

      it('returns selected groups', () => {
        expect(
          getPopulationSelectedItems({
            allSquadAthletes: SQUAD_ATHLETES_DATA.squads,
            groups: GROUPS_DATA,
            labels: LABELS_DATA,
            population: mergeWithEmptySelection({
              segments: [1, 3],
            }),
            squads: [],
          })
        ).toEqual(['Group 1', 'Group 3']);
      });
    });

    describe('getAvailabilityCalculationOptions', () => {
      const withoutProportion = [
        {
          value: 'count',
          label: 'Count',
        },
        {
          value: 'percentage',
          label: 'Percentage',
        },
      ];

      const withProportion = [
        {
          value: 'proportion',
          label: 'Proportion',
        },
        withoutProportion[0],
        withoutProportion[1],
      ];

      const withoutCount = [withoutProportion[1]];

      const withoutCountWithProportion = [withProportion[1], withoutCount[0]];

      it('returns count and proportion options when nothing is passed in', () => {
        const result = getAvailabilityCalculationOptions({});

        expect(result).toEqual(withProportion);
      });

      it('returns count and proportion options when both hideProportionOption and hideCountOption are false', () => {
        const result = getAvailabilityCalculationOptions({
          hideProportion: false,
          hideCount: false,
        });
        expect(result).toEqual(withProportion);
      });

      it('does not return proportion option when hideProportionOption is true', () => {
        const result = getAvailabilityCalculationOptions({
          hideProportion: true,
          hideCount: false,
        });
        expect(result).toEqual(withoutProportion);
      });

      it('does not return count option when hideCountOption is true', () => {
        const result = getAvailabilityCalculationOptions({
          hideProportion: true,
          hideCount: false,
        });
        expect(result).toEqual(withoutCountWithProportion);
      });

      it('does not return both count and proportion options when both hideCountOption and hideProportionOption are true', () => {
        const result = getAvailabilityCalculationOptions({
          hideProportion: true,
          hideCount: true,
        });
        expect(result).toEqual(withoutCount);
      });

      it('does not return  proportion, and percentage when both hideCountPercentagen and hideProportionOption are true', () => {
        const result = getAvailabilityCalculationOptions({
          hideProportion: true,
          hideCount: false,
          hidePercentage: true,
        });
        expect(result).toEqual([withoutProportion[0]]);
      });
    });

    describe('data preparation for formula submission', () => {
      const columnPanelDetails = {
        inputs: {
          A: {
            dataSource: {
              data_source_type: 'TableMetric',
              variable: 'training_session_minutes',
              source: 'kitman',
            },
            population: null,
            time_scope: { time_period: 'this_season_so_far' },
            calculation: 'sum',
            element_config: null,
          },
          B: {
            dataSource: {
              data_source_type: 'TableMetric',
              variable: 'training_session_minutes',
              source: 'kitman',
            },
            population: {
              applies_to_squad: false,
              all_squads: false,
              position_groups: [],
              positions: [],
              athletes: [],
              squads: [3510],
              context_squads: [3510],
              users: [],
              labels: [],
              segments: [],
            },
            time_scope: { time_period: 'this_season_so_far' },
            calculation: 'sum',
            element_config: null,
          },
        },
      };

      const codingSystemKey = '';

      it('produces the expected output for prepareColumnFormulaSubmissionData', () => {
        const output = prepareColumnFormulaSubmissionData(
          columnPanelDetails,
          codingSystemKey,
          ACTIVE_FORMULA_MOCK
        );
        expect(output).toEqual(ADD_FORMULA_COLUMN_MOCK);
      });

      it('produces the expected output for prepareChartFormulaSubmissionData', () => {
        const id = 123;
        const output = prepareChartFormulaSubmissionData({
          columnPanelDetails: {
            ...columnPanelDetails,
            inheritGroupings: true,
          },
          codingSystemKey,
          activeFormula: ACTIVE_FORMULA_MOCK,
          id,
          seriesType: 'value',
          axisConfig: 'left',
        });
        expect(output).toEqual(ADD_FORMULA_CHART_MOCK);
      });
    });
  });

  describe('hasValidComparativePeriod', () => {
    it('should return true if comparative_period_type is not "custom"', () => {
      const params = {
        comparative_period_type: 'all',
        comparative_period: null,
      };
      expect(hasValidComparativePeriod(params)).toBe(true);
    });

    it('should return true if comparative_period_type is "custom" but comparative_period exists', () => {
      const params = {
        comparative_period_type: 'custom',
        comparative_period: 150,
      };
      expect(hasValidComparativePeriod(params)).toBe(true);
    });

    it('should return false if comparative_period_type is "custom" and comparative_period is null', () => {
      const params = {
        comparative_period_type: 'custom',
        comparative_period: null,
      };
      expect(hasValidComparativePeriod(params)).toBe(false);
    });
  });

  describe('hasValidTimePeriod', () => {
    it('should return true if time_period is not "last_x_days"', () => {
      const params = {
        time_period: 'this_season',
        time_period_length: null,
        time_period_length_unit: null,
      };
      expect(hasValidTimePeriod(params)).toBe(true);
    });

    it('should return true if time_period is "last_x_days" and both time_period_length and time_period_length_unit exist', () => {
      const params = {
        time_period: 'last_x_days',
        time_period_length: 30,
        time_period_length_unit: 'days',
      };
      expect(hasValidTimePeriod(params)).toBe(true);
    });

    it('should return false if time_period is "last_x_days" but time_period_length or time_period_length_unit is missing', () => {
      const params = {
        time_period: 'last_x_days',
        time_period_length: null,
        time_period_length_unit: 'days',
      };
      expect(hasValidTimePeriod(params)).toBe(false);
    });
  });

  describe('hasRequiredCalculationValues', () => {
    it('should return true if all required params are present in calculationParams', () => {
      const requiredParams = ['evaluated_period', 'comparative_period'];
      const calculationParams = {
        evaluated_period: 100,
        comparative_period: 50,
      };
      expect(
        hasRequiredCalculationValues(requiredParams, calculationParams)
      ).toBe(true);
    });

    it('should return false if any required param is missing in calculationParams', () => {
      const requiredParams = ['evaluated_period', 'comparative_period'];
      const calculationParams = { evaluated_period: 100 };
      expect(
        hasRequiredCalculationValues(requiredParams, calculationParams)
      ).toBe(false);
    });
  });

  describe('isValidCalculation', () => {
    it('should return false if calculation is null or undefined', () => {
      expect(isValidCalculation(null)).toBe(false);
      expect(isValidCalculation(undefined)).toBe(false);
    });

    it('should return false if requiredParams are missing from calculationParamsMap', () => {
      expect(isValidCalculation('standard_deviation', {})).toBe(false);
    });

    it('should return true if calculation in not in calculationParamsMap', () => {
      const calculation = 'sum';
      expect(isValidCalculation(calculation)).toBe(true);
    });

    it('should return true if calculation is valid and all checks pass', () => {
      const calculation = 'complex_z_score';
      const calculationParams = {
        evaluated_period: 30,
        comparative_period_type: 'custom',
        comparative_period: 50,
        operator: 'sum',
      };
      expect(isValidCalculation(calculation, calculationParams)).toBe(true);
    });

    it('should return false if any of the checks fail', () => {
      const calculation = 'standard_deviation';
      const calculationParams = {
        time_period: 'last_x_days',
        time_period_length: undefined,
      };
      expect(isValidCalculation(calculation, calculationParams)).toBe(false);
    });
  });

  describe('copyPrimaryGrouping', () => {
    it('copies the primary grouping from numerator to denominator while preserving other properties', () => {
      const inputs = {
        [FORMULA_INPUT_IDS.numerator]: {
          element_config: {
            groupings: ['side'], // Existing grouping
          },
        },
        [FORMULA_INPUT_IDS.denominator]: {
          element_config: {
            groupings: [], // No primary grouping
          },
        },
      };

      const shouldInheritGrouping = true;
      const result = copyPrimaryGrouping(inputs, shouldInheritGrouping);

      expect(
        result[FORMULA_INPUT_IDS.numerator].element_config.groupings
      ).toEqual(['side']);
      expect(
        result[FORMULA_INPUT_IDS.denominator].element_config.groupings
      ).toEqual(['side']); // Inherited from numerator
    });

    it('does not copies the primary grouping when shouldInherit is set to "false"', () => {
      const inputs = {
        [FORMULA_INPUT_IDS.numerator]: {
          element_config: {
            groupings: ['side'],
          },
        },
        [FORMULA_INPUT_IDS.denominator]: {
          element_config: {
            groupings: [],
          },
        },
      };

      const shouldInheritGrouping = false;
      const result = copyPrimaryGrouping(inputs, shouldInheritGrouping);

      expect(
        result[FORMULA_INPUT_IDS.numerator].element_config.groupings
      ).toEqual(['side']);
      expect(
        result[FORMULA_INPUT_IDS.denominator].element_config.groupings
      ).toEqual([]); // Empty grouping
    });

    describe('getInputParamsFromSource', () => {
      it('returns correct params for metric source', () => {
        const dataSource = {
          source: 'combination',
          variable: '%_difference',
        };
        const result = getInputParamsFromSource(
          TABLE_WIDGET_DATA_SOURCES.metric,
          dataSource
        );
        expect(result).toStrictEqual({
          source: 'combination',
          variable: '%_difference',
        });
      });

      it('returns correct params for activity source', () => {
        const dataSource = { ids: [1, 2, 3], type: 'PrincipleType' };
        const result = getInputParamsFromSource(
          TABLE_WIDGET_DATA_SOURCES.activity,
          dataSource
        );
        expect(result).toStrictEqual({
          ids: [1, 2, 3],
          type: 'PrincipleType',
        });
      });

      it('returns correct params for participation source', () => {
        const dataSource = {
          ids: [1, 2],
          status: 'participation_levels',
          type: 'ParticipationLevel',
        };
        const result = getInputParamsFromSource(
          TABLE_WIDGET_DATA_SOURCES.participation,
          dataSource
        );
        expect(result).toStrictEqual({
          participation_level_ids: [1, 2],
          status: 'participation_levels',
        });
      });

      it('returns correct params for games source', () => {
        const dataSource = {
          position_ids: [],
          kinds: undefined,
          result: 'win',
          formation_ids: undefined,
          type: 'GameResultAthlete',
        };
        const result = getInputParamsFromSource(
          TABLE_WIDGET_DATA_SOURCES.games,
          dataSource
        );
        expect(result).toStrictEqual({
          position_ids: [],
          kinds: undefined,
          result: 'win',
          formation_ids: undefined,
        });
      });

      it('returns correct params for availability source', () => {
        const dataSource = { status: 'available' };
        const result = getInputParamsFromSource(
          TABLE_WIDGET_DATA_SOURCES.availability,
          dataSource
        );
        expect(result).toStrictEqual({ status: 'available' });
      });

      it('returns correct params for maturity estimate source', () => {
        const id = 3;
        const dataSource = { training_variable_ids: [id] };
        const result = getInputParamsFromSource(
          TABLE_WIDGET_DATA_SOURCES.growthAndMaturation,
          dataSource
        );
        expect(result).toStrictEqual({ training_variable_ids: [id] });
      });

      it('returns empty object for unknown source', () => {
        const dataSource = { result: 'win' };
        const result = getInputParamsFromSource('unknown', dataSource);
        expect(result).toStrictEqual({});
      });
    });
  });

  describe('filterGroupingsByCategory', () => {
    it('returns an empty array when groupings is undefined', () => {
      expect(filterGroupingsByCategory(undefined, 'population')).toStrictEqual(
        []
      );
    });

    it('returns an empty array when the category is not found', () => {
      expect(
        filterGroupingsByCategory(MOCK_CATEGORIZED_GROUPINGS, 'not-a-category')
      ).toStrictEqual([]);
    });

    it('filters a list of groupings by the category provided - population', () => {
      expect(
        filterGroupingsByCategory(MOCK_CATEGORIZED_GROUPINGS, 'population')
      ).toStrictEqual([
        {
          key: 'grouping_a',
          name: 'Athlete',
          category: 'population',
          category_name: 'Population',
          order: 1,
          category_order: 1,
        },
      ]);
    });

    it('filters a list of groupings by the category provided - medical', () => {
      expect(
        filterGroupingsByCategory(MOCK_CATEGORIZED_GROUPINGS, 'medical')
      ).toStrictEqual([
        {
          key: 'body_area',
          name: 'Body Area',
          category: 'medical',
          category_name: 'medical',
          order: 2,
          category_order: 1,
        },
      ]);
    });

    it('returns a list of unique groupings that are filtered by the category provided', () => {
      const groupings = [
        {
          name: 'Availability',
          groupings: [
            {
              key: 'athlete_id',
              name: 'Athlete',
              category: 'population',
              category_name: 'Population',
              order: 1,
              category_order: 1,
            },
            {
              key: 'position',
              name: 'Position',
              category: 'population',
              category_name: 'Population',
              order: 3,
              category_order: 1,
            },
          ],
        },
        {
          name: 'CustomEventType',
          groupings: [
            {
              key: 'athlete_id',
              name: 'Athlete',
              category: 'population',
              category_name: 'Population',
              order: 1,
              category_order: 1,
            },
            {
              key: 'position',
              name: 'Position',
              category: 'population',
              category_name: 'Population',
              order: 3,
              category_order: 1,
            },
          ],
        },
      ];
      expect(filterGroupingsByCategory(groupings, 'population')).toStrictEqual([
        {
          key: 'athlete_id',
          name: 'Athlete',
          category: 'population',
          category_name: 'Population',
          order: 1,
          category_order: 1,
        },
        {
          key: 'position',
          name: 'Position',
          category: 'population',
          category_name: 'Population',
          order: 3,
          category_order: 1,
        },
      ]);
    });
  });

  describe('filterGroupingsByKey', () => {
    it('returns an empty array when groupings is undefined', () => {
      expect(filterGroupingsByKey(undefined, 'athlete_id')).toStrictEqual([]);
    });

    it('returns an empty array when the key is not found', () => {
      expect(
        filterGroupingsByKey(MOCK_CATEGORIZED_GROUPINGS, 'not-a-key')
      ).toStrictEqual([]);
    });

    it('filters a list of groupings by the key provided - micro_cycle', () => {
      expect(
        filterGroupingsByKey(MOCK_CATEGORIZED_GROUPINGS, 'micro_cycle')
      ).toStrictEqual([
        {
          key: 'micro_cycle',
          name: 'Week of Training',
          category: 'timestamp',
          category_name: 'Time',
          order: 2,
          category_order: 2,
        },
      ]);
    });

    it('returns a list of unique groupings that are filtered by the key provided', () => {
      const groupings = [
        {
          name: 'Availability',
          groupings: [
            {
              key: 'athlete_id',
              name: 'Athlete',
              category: 'population',
              category_name: 'Population',
              order: 1,
              category_order: 1,
            },
            {
              key: 'position',
              name: 'Position',
              category: 'population',
              category_name: 'Population',
              order: 3,
              category_order: 1,
            },
          ],
        },
        {
          name: 'CustomEventType',
          groupings: [
            {
              key: 'athlete_id',
              name: 'Athlete',
              category: 'population',
              category_name: 'Population',
              order: 1,
              category_order: 1,
            },
            {
              key: 'position',
              name: 'Position',
              category: 'population',
              category_name: 'Population',
              order: 3,
              category_order: 1,
            },
          ],
        },
      ];
      expect(filterGroupingsByKey(groupings, 'athlete_id')).toStrictEqual([
        {
          key: 'athlete_id',
          name: 'Athlete',
          category: 'population',
          category_name: 'Population',
          order: 1,
          category_order: 1,
        },
      ]);
    });
  });

  describe('addLabelToDynamicRows', () => {
    it('should return unchanged state if label is "value"', () => {
      const prev = { row1: ['test'] };
      const result = addLabelToDynamicRows(prev, 'row1', 'value');
      expect(result).toStrictEqual(prev);
    });

    it('should add a label to an existing array if it does not already exist', () => {
      const prev = { row1: ['label1'] };
      const result = addLabelToDynamicRows(prev, 'row1', 'label2');
      expect(result).toStrictEqual({ row1: ['label1', 'label2'] });
    });

    it('should return unchanged state if the label already exists', () => {
      const prev = { row1: ['label1'] };
      const result = addLabelToDynamicRows(prev, 'row1', 'label1');
      expect(result).toStrictEqual(prev);
    });

    it('should create a new key with the label if the key does not exist', () => {
      const prev = {};
      const result = addLabelToDynamicRows(prev, 'row2', 'labelX');
      expect(result).toStrictEqual({ row2: ['labelX'] });
    });

    it('should return unchanged state if the label is equal to "not_available"', () => {
      const prev = { row1: ['label1'] };
      const result = addLabelToDynamicRows(prev, 'row1', NOT_AVAILABLE.label);
      expect(result).toStrictEqual(prev);
    });
  });

  describe('hasValidGrouping', () => {
    it('returns false when groupings is null or undefined', () => {
      expect(hasValidGrouping(null)).toBe(false);
      expect(hasValidGrouping(undefined)).toBe(false);
    });

    it('returns false when the value is no_grouping', () => {
      expect(hasValidGrouping([NO_GROUPING])).toBe(false);
    });

    it('returns true when groupings has a valid element', () => {
      expect(hasValidGrouping(['position'])).toBe(true);
    });
  });

  describe('getColumnCachedAt', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return empty string if table_element.cached_at is null', () => {
      const result = getColumnCachedAt({
        table_element: { cached_at: null },
      });
      expect(result).toEqual('');
    });

    it('should return calculated cached at if present', () => {
      const params = {
        table_element: { cached_at: '2025-08-26T12:09:24.143+01:00' },
        calculatedCachedAt: '2025-08-26T12:10:24.143+01:00',
      };
      const result = getColumnCachedAt(params);
      expect(result).toEqual(params.calculatedCachedAt);
    });

    it('should return cached_at timestamp from BE if calculated cached at is empty', () => {
      const params = {
        table_element: { cached_at: '2025-08-26T12:09:24.143+01:00' },
      };
      const result = getColumnCachedAt(params);
      expect(result).toEqual(params.table_element.cached_at);
    });
  });

  describe('calculateSummary', () => {
    it('computes mean for negative sums', () => {
      expect(getSummaryValue('mean', [0.46, -0.24])).toEqual('0.11');
    });

    it('handles and returns 0 mean when sum is 0 and there is data', () => {
      expect(getSummaryValue('mean', [-0.24, 0.24])).toEqual(0);
    });

    it('handles and returns 0 mean when there are no filled values', () => {
      expect(getSummaryValue('mean', [])).toEqual(0);
    });
  });

  describe('getCachedAtRolloverContent', () => {
    let params;

    beforeEach(() => {
      window.setFlag('rep-table-widget-caching', true);
      humanizeTimestamp.mockReturnValue('a minute ago');
      params = {
        cachedAt: '2025-07-02T10:22:20.232+01:00',
        dataStatus: 'SUCCESS',
        locale: 'en-gb',
      };
    });

    it('should return empty string if cachedAt is null', () => {
      params.cachedAt = '';
      const result = getCachedAtRolloverContent(
        params.cachedAt,
        params.dataStatus,
        params.locale
      );

      expect(result).toEqual('');
    });

    it('should return "Calculating" if data status is Caching', () => {
      params.dataStatus = 'CACHING';
      const result = getCachedAtRolloverContent(
        params.cachedAt,
        params.dataStatus,
        params.locale
      );

      expect(result).toEqual('Calculating...');
    });

    it('should return humanized timestamp', () => {
      const result = getCachedAtRolloverContent(
        params.cachedAt,
        params.dataStatus,
        params.locale
      );
      expect(result).toEqual('Last Calculated: a minute ago');
    });

    it('should return empty if feature flag is turned off', () => {
      window.setFlag('rep-table-widget-caching', false);
      const result = getCachedAtRolloverContent(
        params.cachedAt,
        params.dataStatus,
        params.locale
      );

      expect(result).toEqual('');
    });
  });

  describe('sortDynamicRows', () => {
    const mockedSortFunction = jest.fn((items) => {
      return [...items].sort((a, b) => a.value - b.value);
    });

    const mockedChildren = [
      { id: 'label1', value: '10' },
      { id: 'label2', value: '5' },
      { id: 'label3', value: '15' },
    ];

    it('should return unchanged rowsToUpdate if item is not preset', () => {
      const item = { id: 'row1', children: [] };
      const rowsToUpdate = { row2: ['label1', 'label2'] };

      const result = sortDynamicRows(item, rowsToUpdate, mockedSortFunction);

      expect(result).toEqual(rowsToUpdate);
      expect(mockedSortFunction).not.toHaveBeenCalled();
    });

    it('should sort child rows based on the provided sortRows function', () => {
      const item = {
        id: 'row1',
        children: mockedChildren,
      };
      const rowsToUpdate = { row1: ['label1', 'label2', 'label3'] };

      const result = sortDynamicRows(item, rowsToUpdate, mockedSortFunction);

      expect(result).toEqual({ row1: ['label2', 'label1', 'label3'] });
      expect(mockedSortFunction).toHaveBeenCalledWith(mockedChildren);
    });
  });
});
