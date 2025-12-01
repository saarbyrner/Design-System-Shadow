import { waitFor } from '@testing-library/react';
import structuredClone from 'core-js/stable/structured-clone';
import $ from 'jquery';
import { axios } from '@kitman/common/src/utils/services';
import { REDUCER_KEY as COLUMN_FORMULA_PANEL_REDUCER_KEY } from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';
// eslint-disable-next-line jest/no-mocks-import
import {
  ACTIVE_FORMULA_MOCK,
  COLUMN_FORMULA_PANEL_STATE,
  ADD_FORMULA_COLUMN_MOCK,
} from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/tableWidget';
import { data as formulaColumnServerResponse } from '@kitman/services/src/mocks/handlers/analysis/addTableFormulaColumn';
import { fetchWidgetContent } from '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets';
import {
  addEditTableColumnLoading,
  applyComparisonTableColumnFormula,
  clickComparisonTableColumnPanelApply,
  clickComparisonTableRowPanelApply,
  clickLongitudinalTableColumnPanelApply,
  clickLongitudinalTableRowPanelApply,
  clickScorecardTableColumnPanelApply,
  clickScorecardTableRowPanelApply,
  editComparisonTableColumn,
  editComparisonTableColumnSuccess,
  editComparisonTableRowSuccess,
  editLongitudinalTableColumn,
  editLongitudinalTableColumnSuccess,
  editLongitudinalTableRowSuccess,
  editScorecardTableColumn,
  editScorecardTableColumnSuccess,
  editScorecardTableRowSuccess,
  editTableColumnFailure,
  editTableRow,
  editTableRowFailure,
  editTableRowLoading,
  openTableColumnPanel,
  openTableRowPanel,
  setColumnPanelInputParams,
  setRowPanelInputParams,
  setTableColumnActivity,
  setTableColumnCalculation,
  setTableColumnCalculationParam,
  setTableColumnDataSourceIds,
  setTableColumnDataSourceType,
  setTableColumnDateRange,
  setTableColumnEventType,
  setTableColumnGameKinds,
  setTableColumnGameResult,
  setTableColumnMetrics,
  setTableColumnPopulation,
  setTableColumnStatus,
  setTableColumnSubType,
  setTableColumnTimeInFormation,
  setTableColumnTimeInPositions,
  setTableColumnTimePeriod,
  setTableColumnTitle,
  setTableRowActivity,
  setTableRowCalculation,
  setTableRowCalculationParam,
  setTableRowDataSourceIds,
  setTableRowDataSourceType,
  setTableRowDateRange,
  setTableRowEventType,
  setTableRowGameKinds,
  setTableRowGameResult,
  setTableRowMetrics,
  setTableRowPopulation,
  setTableRowGroupings,
  setTableRowStatus,
  setTableRowSubtype,
  setTableRowTimeInFormation,
  setTableRowTimeInPositions,
  setTableRowTimePeriod,
  setTableRowTimePeriodLength,
  setTableRowTimePeriodLengthOffset,
  setTableRowTitle,
  toggleTableColumnPanel,
  toggleTableRowPanel,
} from '../panel';

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/Dashboard/redux/actions/widgets'
    ),
    fetchWidgetContent: jest.fn(),
  })
);

describe('Table Widget Panel Actions', () => {
  afterEach(() => {
    fetchWidgetContent.mockClear();
  });

  it('has the correct action OPEN_TABLE_COLUMN_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_TABLE_COLUMN_PANEL',
      payload: {
        source: 'metric',
        widgetId: 26,
        existingTableColumns: [
          {
            id: 999,
            name: 'test column',
            metric: {
              key_name: 'combination|%_difference',
              name: '% Difference',
              description: 'combination',
            },
            summary: 'mean',
            time_scope: {
              time_period: 'today',
            },
          },
        ],
        existingTableRows: [
          {
            id: 1,
            name: 'test row',
            metric: {
              key_name: 'combination|%_difference',
              name: '% Difference',
              description: 'combination',
            },
            summary: 'mean',
            time_scope: {
              time_period: 'today',
            },
          },
        ],
        tableContainerId: 1234,
        tableName: 'Test Table Name',
        tableType: 'SCORECARD',
        showSummary: true,
      },
    };

    expect(
      openTableColumnPanel(
        'metric',
        26,
        [
          {
            id: 999,
            name: 'test column',
            metric: {
              key_name: 'combination|%_difference',
              name: '% Difference',
              description: 'combination',
            },
            summary: 'mean',
            time_scope: {
              time_period: 'today',
            },
          },
        ],
        [
          {
            id: 1,
            name: 'test row',
            metric: {
              key_name: 'combination|%_difference',
              name: '% Difference',
              description: 'combination',
            },
            summary: 'mean',
            time_scope: {
              time_period: 'today',
            },
          },
        ],
        1234,
        'Test Table Name',
        'SCORECARD',
        true
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action OPEN_TABLE_ROW_PANEL', () => {
    const expectedAction = {
      type: 'OPEN_TABLE_ROW_PANEL',
      payload: {
        source: 'metric',
        widgetId: 1234,
        existingTableColumns: [],
        existingTableRows: [
          {
            id: 1,
            name: 'test row',
            metric: {
              key_name: 'combination|%_difference',
              name: '% Difference',
              description: 'combination',
            },
            summary: 'mean',
            time_scope: {
              time_period: 'today',
            },
          },
        ],
        tableContainerId: 9,
        tableName: 'Test Table Name',
        tableType: 'SCORECARD',
        showSummary: false,
      },
    };

    expect(
      openTableRowPanel(
        'metric',
        1234,
        [],
        [
          {
            id: 1,
            name: 'test row',
            metric: {
              key_name: 'combination|%_difference',
              name: '% Difference',
              description: 'combination',
            },
            summary: 'mean',
            time_scope: {
              time_period: 'today',
            },
          },
        ],
        9,
        'Test Table Name',
        'SCORECARD',
        false
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action EDIT_COMPARISON_TABLE_COLUMN', () => {
    const expectedAction = {
      type: 'EDIT_COMPARISON_TABLE_COLUMN',
      payload: {
        widgetId: 123,
        existingTableColumns: [
          { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
        ],
        tableContainerId: 90,
        columnDetails: {
          id: 555,
          metric: { key_name: 'Testing' },
          name: 'Test',
          summary: 'sum',
          time_scope: {
            time_period: 'today',
          },
        },
        tableType: 'COMPARISON',
      },
    };

    expect(
      editComparisonTableColumn(
        123,
        [{ name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } }],
        90,
        {
          id: 555,
          metric: { key_name: 'Testing' },
          name: 'Test',
          summary: 'sum',
          time_scope: {
            time_period: 'today',
          },
        },
        'COMPARISON'
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action EDIT_SCORECARD_TABLE_COLUMN', () => {
    const expectedAction = {
      type: 'EDIT_SCORECARD_TABLE_COLUMN',
      payload: {
        widgetId: 123,
        existingTableColumns: [
          { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
        ],
        tableContainerId: 90,
        columnDetails: {
          id: 555,
          metric: { key_name: 'Testing' },
          name: 'Test',
          population: {
            applies_to_squad: true,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          summary: 'sum',
          time_scope: {
            time_period: 'today',
          },
        },
        tableType: 'SCORECARD',
      },
    };

    expect(
      editScorecardTableColumn(
        123,
        [{ name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } }],
        90,
        {
          id: 555,
          metric: { key_name: 'Testing' },
          name: 'Test',
          population: {
            applies_to_squad: true,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          summary: 'sum',
          time_scope: {
            time_period: 'today',
          },
        },
        'SCORECARD'
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action EDIT_LONGITUDINAL_TABLE_COLUMN', () => {
    const expectedAction = {
      type: 'EDIT_LONGITUDINAL_TABLE_COLUMN',
      payload: {
        widgetId: 123,
        existingTableColumns: [
          { name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } },
        ],
        tableContainerId: 90,
        columnDetails: {
          id: 555,
          metric: { key_name: 'Testing' },
          name: 'Test',
          population: {
            applies_to_squad: true,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          summary: 'sum',
          time_scope: {
            time_period: 'today',
          },
        },
        tableType: 'LONGITUDINAL',
      },
    };

    expect(
      editLongitudinalTableColumn(
        123,
        [{ name: 'Reducer Test', metric: { key_name: 'kitman|blah|test' } }],
        90,
        {
          id: 555,
          metric: { key_name: 'Testing' },
          name: 'Test',
          population: {
            applies_to_squad: true,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          summary: 'sum',
          time_scope: {
            time_period: 'today',
          },
        },
        'LONGITUDINAL'
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action EDIT_TABLE_ROW', () => {
    const expectedAction = {
      type: 'EDIT_TABLE_ROW',
      payload: {
        row: {
          id: 1,
          name: 'test row',
          metric: {
            key_name: 'combination|%_difference',
            name: '% Difference',
            description: 'combination',
          },
          summary: 'mean',
          time_scope: {
            time_period: 'today',
          },
        },
        tableContainerId: 1000,
        tableType: 'SCORECARD',
        widgetId: 1,
      },
    };

    expect(
      editTableRow(
        {
          id: 1,
          name: 'test row',
          metric: {
            key_name: 'combination|%_difference',
            name: '% Difference',
            description: 'combination',
          },
          summary: 'mean',
          time_scope: {
            time_period: 'today',
          },
        },
        1000,
        'SCORECARD',
        1
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action TOGGLE_TABLE_COLUMN_PANEL', () => {
    const expectedAction = {
      type: 'TOGGLE_TABLE_COLUMN_PANEL',
    };

    expect(toggleTableColumnPanel()).toEqual(expectedAction);
  });

  it('has the correct action TOGGLE_TABLE_ROW_PANEL', () => {
    const expectedAction = {
      type: 'TOGGLE_TABLE_ROW_PANEL',
    };

    expect(toggleTableRowPanel()).toEqual(expectedAction);
  });

  it('has the correct action ADD_EDIT_TABLE_COLUMN_LOADING', () => {
    const expectedAction = {
      type: 'ADD_EDIT_TABLE_COLUMN_LOADING',
    };

    expect(addEditTableColumnLoading()).toEqual(expectedAction);
  });

  it('has the correct action EDIT_TABLE_COLUMN_FAILURE', () => {
    const expectedAction = {
      type: 'EDIT_TABLE_COLUMN_FAILURE',
    };

    expect(editTableColumnFailure()).toEqual(expectedAction);
  });

  it('has the correct action EDIT_COMPARISON_TABLE_COLUMN_SUCCESS', () => {
    const expectedAction = {
      type: 'EDIT_COMPARISON_TABLE_COLUMN_SUCCESS',
      payload: {
        widgetId: 1,
        columnPanelDetails: {
          columnId: 123,
          name: 'Test',
          metrics: [{ key_name: 'Test Metric' }],
          calculation: 'sum',
          time_scope: {
            start_time: undefined,
            end_time: undefined,
            time_period: 'this_season',
            time_period_length: undefined,
          },
        },
      },
    };

    expect(
      editComparisonTableColumnSuccess(1, {
        columnId: 123,
        name: 'Test',
        metrics: [{ key_name: 'Test Metric' }],
        calculation: 'sum',
        time_scope: {
          start_time: undefined,
          end_time: undefined,
          time_period: 'this_season',
          time_period_length: undefined,
        },
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action EDIT_SCORECARD_TABLE_COLUMN_SUCCESS', () => {
    const expectedAction = {
      type: 'EDIT_SCORECARD_TABLE_COLUMN_SUCCESS',
      payload: {
        widgetId: 1,
        columnPanelDetails: {
          columnId: 123,
          name: 'Test',
          metrics: [{ key_name: 'Test Metric' }],
          calculation: 'sum',
          population: {
            applies_to_squad: false,
            position_groups: [],
            positions: [3333],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          time_scope: {
            start_time: undefined,
            end_time: undefined,
            time_period: 'this_season',
            time_period_length: undefined,
          },
        },
      },
    };

    expect(
      editScorecardTableColumnSuccess(1, {
        columnId: 123,
        name: 'Test',
        metrics: [{ key_name: 'Test Metric' }],
        calculation: 'sum',
        population: {
          applies_to_squad: false,
          position_groups: [],
          positions: [3333],
          athletes: [],
          all_squads: false,
          squads: [],
        },
        time_scope: {
          start_time: undefined,
          end_time: undefined,
          time_period: 'this_season',
          time_period_length: undefined,
        },
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action EDIT_LONGITUDINAL_TABLE_COLUMN_SUCCESS', () => {
    const expectedAction = {
      type: 'EDIT_LONGITUDINAL_TABLE_COLUMN_SUCCESS',
      payload: {
        widgetId: 1,
        columnPanelDetails: {
          columnId: 123,
          name: 'Test',
          metrics: [{ key_name: 'Test Metric' }],
          calculation: 'sum',
          population: {
            applies_to_squad: false,
            position_groups: [123],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
        },
      },
    };

    expect(
      editLongitudinalTableColumnSuccess(1, {
        columnId: 123,
        name: 'Test',
        metrics: [{ key_name: 'Test Metric' }],
        calculation: 'sum',
        population: {
          applies_to_squad: false,
          position_groups: [123],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action EDIT_COMPARISON_TABLE_ROW_SUCCESS', () => {
    const expectedAction = {
      type: 'EDIT_COMPARISON_TABLE_ROW_SUCCESS',
      payload: {
        rowPanelDetails: {
          calculation: 'sum',
          isEditMode: true,
          rowId: 1,
          metrics: [{ id: 1, name: 'Fatigue' }],
          population: {
            applies_to_squad: true,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          time_scope: {
            time_period: '',
            start_time: undefined,
            end_time: undefined,
            time_period_length: undefined,
          },
        },
        widgetId: 1,
        newRow: { row_id: 123 },
      },
    };

    expect(
      editComparisonTableRowSuccess(
        {
          calculation: 'sum',
          isEditMode: true,
          rowId: 1,
          metrics: [{ id: 1, name: 'Fatigue' }],
          population: {
            applies_to_squad: true,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          time_scope: {
            time_period: '',
            start_time: undefined,
            end_time: undefined,
            time_period_length: undefined,
          },
        },
        1,
        { row_id: 123 }
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action EDIT_SCORECARD_TABLE_ROW_SUCCESS', () => {
    const expectedAction = {
      type: 'EDIT_SCORECARD_TABLE_ROW_SUCCESS',
      payload: {
        rowPanelDetails: {
          calculation: 'sum',
          isEditMode: true,
          rowId: 1,
          metrics: [{ id: 1, name: 'Fatigue' }],
          time_scope: {
            time_period: '',
            start_time: undefined,
            end_time: undefined,
            time_period_length: undefined,
          },
        },
        widgetId: 1,
      },
    };

    expect(
      editScorecardTableRowSuccess(
        {
          calculation: 'sum',
          isEditMode: true,
          rowId: 1,
          metrics: [{ id: 1, name: 'Fatigue' }],
          time_scope: {
            time_period: '',
            start_time: undefined,
            end_time: undefined,
            time_period_length: undefined,
          },
        },
        1
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action EDIT_LONGITUDINAL_TABLE_ROW_SUCCESS', () => {
    const expectedAction = {
      type: 'EDIT_LONGITUDINAL_TABLE_ROW_SUCCESS',
      payload: {
        rowPanelDetails: {
          calculation: 'sum',
          isEditMode: true,
          rowId: 1,
          metrics: [],
          time_scope: {
            time_period: 'this_season',
            start_time: null,
            end_time: null,
            time_period_length: null,
            time_period_length_offset: null,
          },
        },
        widgetId: 1,
      },
    };

    expect(
      editLongitudinalTableRowSuccess(
        {
          calculation: 'sum',
          isEditMode: true,
          rowId: 1,
          metrics: [],
          time_scope: {
            time_period: 'this_season',
            start_time: null,
            end_time: null,
            time_period_length: null,
            time_period_length_offset: null,
          },
        },
        1
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action EDIT_TABLE_ROW_LOADING', () => {
    const expectedAction = {
      type: 'EDIT_TABLE_ROW_LOADING',
    };

    expect(editTableRowLoading()).toEqual(expectedAction);
  });

  it('has the correct action EDIT_TABLE_ROW_FAILURE', () => {
    const expectedAction = {
      type: 'EDIT_TABLE_ROW_FAILURE',
    };

    expect(editTableRowFailure()).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_ROW_TITLE', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_TITLE',
      payload: {
        title: 'abc123',
      },
    };

    expect(setTableRowTitle('abc123')).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_ROW_CALCULATION', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_CALCULATION',
      payload: {
        calculation: 'sum',
      },
    };

    expect(setTableRowCalculation('sum')).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_ROW_CALCULATION_PARAM', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_CALCULATION_PARAM',
      payload: {
        calculationParam: 'second_data_source_type',
        value: 'external',
      },
    };

    expect(
      setTableRowCalculationParam('second_data_source_type', 'external')
    ).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_ROW_DATE_RANGE', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_DATE_RANGE',
      payload: {
        range: {
          start_date: '20-8-2020',
          end_date: '25-8-2020',
        },
      },
    };

    expect(
      setTableRowDateRange({
        start_date: '20-8-2020',
        end_date: '25-8-2020',
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_ROW_METRICS', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_METRICS',
      payload: {
        metric: { key_name: 'Blah' },
      },
    };

    expect(setTableRowMetrics({ key_name: 'Blah' })).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_ROW_ACTIVITY ids as number[]', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_ACTIVITY',
      payload: {
        ids: [123],
        type: 'Principle',
        name: 'Principle Name',
      },
    };

    expect(setTableRowActivity([123], 'Principle', 'Principle Name')).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_TABLE_ROW_ACTIVITY ids as number', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_ACTIVITY',
      payload: {
        ids: 123,
        type: 'Principle',
        name: 'Principle Name',
      },
    };

    expect(setTableRowActivity(123, 'Principle', 'Principle Name')).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_TABLE_ROW_STATUS', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_STATUS',
      payload: {
        status: 'available_injured',
        name: 'Available (Injured)',
        type: 'Availability',
      },
    };

    expect(
      setTableRowStatus(
        'available_injured',
        'Available (Injured)',
        'Availability'
      )
    ).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_ROW_SUBTYPE', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_SUBTYPE',
      payload: {
        subtype: 'osics_pathology_ids',
        value: [1, 2],
      },
    };

    expect(setTableRowSubtype('osics_pathology_ids', [1, 2])).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_TABLE_ROW_DATASOURCE_TYPE', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_DATASOURCE_TYPE',
      payload: {
        type: 'ParticipationLevels',
      },
    };

    expect(setTableRowDataSourceType('ParticipationLevels')).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_TABLE_ROW_DATASOURCE_IDS', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_DATASOURCE_IDS',
      payload: {
        ids: [1, 2, 3],
        type: 'ParticipationLevels',
        name: 'New Name',
      },
    };

    expect(
      setTableRowDataSourceIds([1, 2, 3], 'ParticipationLevels', 'New Name')
    ).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_ROW_POPULATION', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_POPULATION',
      payload: {
        population: {
          applies_to_squad: true,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
      },
    };

    expect(
      setTableRowPopulation({
        applies_to_squad: true,
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_ROW_GROUPING', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_GROUPING',
      payload: { groupings: 'athletes' },
    };

    expect(setTableRowGroupings('athletes')).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_ROW_TIME_PERIOD', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_TIME_PERIOD',
      payload: {
        timePeriod: 'today',
      },
    };

    expect(setTableRowTimePeriod('today')).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_ROW_TIME_PERIOD_LENGTH', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_TIME_PERIOD_LENGTH',
      payload: {
        timePeriodLength: 3,
      },
    };

    expect(setTableRowTimePeriodLength(3)).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_ROW_TIME_PERIOD_LENGTH_OFFSET', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_TIME_PERIOD_LENGTH_OFFSET',
      payload: {
        timePeriodLengthOffset: 33,
      },
    };

    expect(setTableRowTimePeriodLengthOffset(33)).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_COLUMN_CALCULATION', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_CALCULATION',
      payload: {
        calculation: 'sum',
      },
    };

    expect(setTableColumnCalculation('sum')).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_COLUMN_CALCULATION_PARAM', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_CALCULATION_PARAM',
      payload: {
        calculationParam: 'time_period',
        value: 2,
      },
    };

    expect(setTableColumnCalculationParam('time_period', 2)).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_TABLE_COLUMN_DATE_RANGE', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_DATE_RANGE',
      payload: {
        range: {
          start_date: '20-8-2020',
          end_date: '25-8-2020',
        },
      },
    };

    expect(
      setTableColumnDateRange({
        start_date: '20-8-2020',
        end_date: '25-8-2020',
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_COLUMN_METRICS', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_METRICS',
      payload: {
        metric: { key_name: 'Blah' },
      },
    };

    expect(setTableColumnMetrics({ key_name: 'Blah' })).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_COLUMN_ACTIVITY', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_ACTIVITY',
      payload: {
        ids: [123],
        type: 'Principle',
      },
    };

    expect(setTableColumnActivity([123], 'Principle')).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_COLUMN_STATUS', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_STATUS',
      payload: {
        status: 'available_injured',
        type: 'Availability',
      },
    };

    expect(setTableColumnStatus('available_injured', 'Availability')).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_TABLE_COLUMN_DATASOURCE_TYPE', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_DATASOURCE_TYPE',
      payload: {
        type: 'ParticipationLevels',
      },
    };

    expect(setTableColumnDataSourceType('ParticipationLevels')).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_TABLE_COLUMN_DATASOURCE_IDS', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_DATASOURCE_IDS',
      payload: {
        ids: [1, 2, 3],
        type: 'ParticipationLevels',
      },
    };

    expect(
      setTableColumnDataSourceIds([1, 2, 3], 'ParticipationLevels')
    ).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_COLUMN_POPULATION', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_POPULATION',
      payload: {
        population: {
          applies_to_squad: true,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
      },
    };

    expect(
      setTableColumnPopulation({
        applies_to_squad: true,
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      })
    ).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_COLUMN_TITLE', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_TITLE',
      payload: {
        title: 'Test',
      },
    };

    expect(setTableColumnTitle('Test')).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_COLUMN_TIME_PERIOD', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_TIME_PERIOD',
      payload: {
        timePeriod: 'today',
      },
    };

    expect(setTableColumnTimePeriod('today')).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_COLUMN_SUBTYPE', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_SUBTYPE',
      payload: {
        subtype: 'osics_pathology_ids',
        value: [1, 2],
      },
    };

    expect(setTableColumnSubType('osics_pathology_ids', [1, 2])).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_TABLE_COLUMN_GAME_KINDS', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_GAME_KINDS',
      payload: {
        kinds: ['goal'],
        type: 'GameActivity',
      },
    };

    expect(setTableColumnGameKinds(['goal'], 'GameActivity')).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_TABLE_ROW_GAME_KINDS', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_GAME_KINDS',
      payload: {
        kinds: ['goal'],
        type: 'GameActivity',
      },
    };

    expect(setTableRowGameKinds(['goal'], 'GameActivity')).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_TABLE_COLUMN_GAME_RESULT', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_GAME_RESULT',
      payload: {
        result: 'win',
        type: 'GameResultAthlete',
      },
    };

    expect(setTableColumnGameResult('win', 'GameResultAthlete')).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_TABLE_ROW_GAME_RESULT', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_GAME_RESULT',
      payload: {
        result: 'win',
        type: 'GameResultAthlete',
      },
    };

    expect(setTableRowGameResult('win', 'GameResultAthlete')).toEqual(
      expectedAction
    );
  });

  it('has the correct action SET_TABLE_COLUMN_TIME_IN_POSITIONS', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_TIME_IN_POSITIONS',
      payload: {
        positions: [1, 2, 3],
      },
    };

    expect(setTableColumnTimeInPositions([1, 2, 3])).toEqual(expectedAction);
  });

  it('has the correct action SET_ROW_COLUMN_TIME_IN_POSITIONS', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_TIME_IN_POSITIONS',
      payload: {
        positions: [1, 2, 3],
      },
    };

    expect(setTableRowTimeInPositions([1, 2, 3])).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_COLUMN_TIME_IN_FORMATION', () => {
    const expectedAction = {
      type: 'SET_TABLE_COLUMN_TIME_IN_FORMATION',
      payload: {
        formations: [1, 2, 3],
      },
    };

    expect(setTableColumnTimeInFormation([1, 2, 3])).toEqual(expectedAction);
  });

  it('has the correct action SET_TABLE_ROW_TIME_IN_FORMATION', () => {
    const expectedAction = {
      type: 'SET_TABLE_ROW_TIME_IN_FORMATION',
      payload: {
        formations: [1, 2, 3],
      },
    };

    expect(setTableRowTimeInFormation([1, 2, 3])).toEqual(expectedAction);
  });

  describe('clickComparisonTableRowPanelApply', () => {
    let mockRequest;

    beforeEach(() => {
      const deferred = $.Deferred();
      mockRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve([]));
    });

    it('sends the correct data', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        tableWidget: {
          appliedColumns: [],
          appliedRows: [],
          rowPanel: {
            isEditMode: false,
            population: {
              applies_to_squad: false,
              position_groups: [123],
              positions: [],
              athletes: [],
              all_squads: false,
              squads: [],
            },
          },
          tableContainerId: 12,
          tableName: 'Table',
          tableType: 'COMPARISON',
          showSummary: false,
          widgetId: 9876,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = clickComparisonTableRowPanelApply({
        applies_to_squad: false,
        position_groups: [123],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      });

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher.mock.calls).toHaveLength(4);
      expect(dispatcher.mock.calls[0][0].type).toEqual(
        'ADD_EDIT_TABLE_ROW_LOADING'
      );

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/table_containers/12/table_rows/bulk_population',
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': undefined,
        },
        data: JSON.stringify({
          bulk_population: {
            applies_to_squad: false,
            position_groups: [123],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
        }),
      });

      expect(dispatcher.mock.calls[1][0].type).toEqual(
        'ADD_MULTIPLE_TABLE_ROW_SUCCESS'
      );

      expect(fetchWidgetContent).toHaveBeenCalledTimes(1);

      expect(dispatcher.mock.calls[3][0].type).toEqual(
        'TOGGLE_TABLE_ROW_PANEL'
      );
    });
  });

  describe('clickLongitudinalTableRowPanelApply', () => {
    let mockRequest;

    beforeEach(() => {
      const deferred = $.Deferred();
      mockRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve([]));
    });

    it('sends the correct data when adding a new row', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        tableWidget: {
          rowPanel: {
            isEditMode: false,
            time_scope: {
              time_period: 'daily',
              start_time: undefined,
              end_time: undefined,
              time_period_length: undefined,
              time_period_length_offset: undefined,
            },
          },
          tableContainerId: 9876,
          tableName: 'Table',
          tableType: 'LONGITUDINAL',
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = clickLongitudinalTableRowPanelApply();

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher.mock.calls).toHaveLength(4);
      expect(dispatcher.mock.calls[0][0].type).toEqual(
        'ADD_EDIT_TABLE_ROW_LOADING'
      );

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/table_containers/9876/table_rows',
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': undefined,
        },
        data: JSON.stringify({
          time_scope: {
            time_period: 'daily',
          },
        }),
      });

      expect(dispatcher.mock.calls[1][0].type).toEqual('ADD_TABLE_ROW_SUCCESS');
      expect(fetchWidgetContent).toHaveBeenCalledTimes(1);
      expect(dispatcher.mock.calls[3][0].type).toEqual(
        'TOGGLE_TABLE_ROW_PANEL'
      );
    });
  });

  describe('clickScorecardTableRowPanelApply', () => {
    let mockRequest;

    beforeEach(() => {
      const deferred = $.Deferred();
      mockRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve([]));
    });

    it('sends the correct data when adding a new row', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        tableWidget: {
          rowPanel: {
            calculation: 'mean',
            isEditMode: false,
            dataSource: {
              id: 123,
              source: 'kitman:tv',
              variable: 'fatigue',
              type: 'TableMetric',
              name: 'Fatigue',
            },
          },
          tableContainerId: 9876,
          tableName: 'Table',
          tableType: 'COMPARISON',
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = clickScorecardTableRowPanelApply();

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher.mock.calls).toHaveLength(5);
      expect(dispatcher.mock.calls[0][0].type).toEqual(
        'ADD_EDIT_TABLE_ROW_LOADING'
      );

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/table_containers/9876/table_rows',
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': undefined,
        },
        data: JSON.stringify({
          data_source_type: 'TableMetric',
          input_params: {
            variable: 'fatigue',
            source: 'kitman:tv',
          },
          name: 'Fatigue',
          summary: 'mean',
          element_config: {},
        }),
      });

      expect(dispatcher.mock.calls[1][0].type).toEqual('ADD_TABLE_ROW_SUCCESS');
      expect(fetchWidgetContent).toHaveBeenCalledTimes(1);
      expect(dispatcher.mock.calls[3][0].type).toEqual(
        'SET_ROW_CALCULATED_CACHED_AT_UPDATE'
      );
      expect(dispatcher.mock.calls[4][0].type).toEqual(
        'TOGGLE_TABLE_ROW_PANEL'
      );
    });

    it('sends the correct data when editing an existing row', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        tableWidget: {
          rowPanel: {
            calculation: 'sum',
            isEditMode: true,
            dataSource: {
              id: 123,
              source: 'kitman:tv',
              variable: 'mood',
              type: 'TableMetric',
              name: 'Mood',
            },
            rowId: 12,
          },
          tableContainerId: 9876,
          tableName: 'Table',
          tableType: 'COMPARISON',
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = clickScorecardTableRowPanelApply();

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher.mock.calls).toHaveLength(5);
      expect(dispatcher.mock.calls[0][0].type).toEqual(
        'ADD_EDIT_TABLE_ROW_LOADING'
      );

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/table_containers/9876/table_rows/12',
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': undefined,
        },
        data: JSON.stringify({
          data_source_type: 'TableMetric',
          input_params: {
            variable: 'mood',
            source: 'kitman:tv',
          },
          name: 'Mood',
          summary: 'sum',
          element_config: {},
        }),
      });

      expect(dispatcher.mock.calls[1][0].type).toEqual(
        'EDIT_SCORECARD_TABLE_ROW_SUCCESS'
      );
      expect(fetchWidgetContent).toHaveBeenCalledTimes(1);
      expect(dispatcher.mock.calls[3][0].type).toEqual(
        'SET_ROW_CALCULATED_CACHED_AT_UPDATE'
      );
      expect(dispatcher.mock.calls[4][0].type).toEqual(
        'TOGGLE_TABLE_ROW_PANEL'
      );
    });
  });

  describe('clickComparisonTableColumnPanelApply', () => {
    let mockRequest;

    beforeEach(() => {
      const deferred = $.Deferred();
      mockRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve([]));
    });

    it('sends the correct data when adding a new comparison column', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        tableWidget: {
          appliedColumns: [],
          appliedPopulation: {
            applies_to_squad: false,
            position_groups: [123],
            positions: [3333],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          columnPanel: {
            isEditMode: false,
            name: 'Test Metric',
            dataSource: {
              type: 'TableMetric',
              source: 'Test',
              variable: 'Metric12',
            },
            calculation: 'sum',
            time_scope: {
              start_time: '',
              end_time: '',
              time_period: 'today',
              time_period_length: null,
            },
          },
          tableContainerId: 12,
          tableName: 'Table Name',
          tableType: 'COMPARISON',
          showSummary: true,
          widgetId: 9876,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = clickComparisonTableColumnPanelApply();

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher.mock.calls).toHaveLength(5);
      expect(dispatcher.mock.calls[0][0].type).toEqual(
        'ADD_EDIT_TABLE_COLUMN_LOADING'
      );

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/table_containers/12/table_columns',
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': undefined,
        },
        data: JSON.stringify({
          name: 'Test Metric',
          data_source_type: 'TableMetric',
          input_params: {
            variable: 'Metric12',
            source: 'Test',
          },
          summary: 'sum',
          time_scope: {
            start_time: '',
            end_time: '',
            time_period: 'today',
            time_period_length: null,
          },
          element_config: {},
        }),
      });

      expect(dispatcher.mock.calls[1][0].type).toEqual(
        'ADD_TABLE_COLUMN_SUCCESS'
      );
      expect(fetchWidgetContent).toHaveBeenCalledTimes(1);
      expect(dispatcher.mock.calls[3][0].type).toEqual(
        'SET_COLUMN_CALCULATED_CACHED_AT_UPDATE'
      );
      expect(dispatcher.mock.calls[4][0].type).toEqual(
        'TOGGLE_TABLE_COLUMN_PANEL'
      );
    });

    it('sends the correct data when editing an existing comparison column', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        tableWidget: {
          appliedColumns: [{ id: 123, name: 'Test' }],
          appliedPopulation: {
            applies_to_squad: false,
            position_groups: [123],
            positions: [3333],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          columnPanel: {
            isEditMode: true,
            name: 'Edit Test',
            dataSource: {
              type: 'TableMetric',
              source: 'Test',
              variable: 'Metric12',
            },
            calculation: 'mean',
            time_scope: {
              time_period: 'today',
            },
            columnId: 123,
            filters: {
              time_loss: [],
              competitions: [],
              event_types: ['game'],
              session_type: [],
              training_session_types: [],
            },
          },
          tableContainerId: 12,
          widgetId: 9876,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = clickComparisonTableColumnPanelApply();

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher.mock.calls).toHaveLength(5);
      expect(dispatcher.mock.calls[0][0].type).toEqual(
        'ADD_EDIT_TABLE_COLUMN_LOADING'
      );

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/table_containers/12/table_columns/123',
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': undefined,
        },
        data: JSON.stringify({
          name: 'Edit Test',
          data_source_type: 'TableMetric',
          input_params: {
            variable: 'Metric12',
            source: 'Test',
          },
          summary: 'mean',
          time_scope: {
            time_period: 'today',
          },
          element_config: {
            filters: {
              event_types: ['game'],
            },
          },
        }),
      });

      expect(dispatcher.mock.calls[1][0].type).toEqual(
        'EDIT_COMPARISON_TABLE_COLUMN_SUCCESS'
      );
      expect(fetchWidgetContent).toHaveBeenCalledTimes(1);
      expect(dispatcher.mock.calls[3][0].type).toEqual(
        'SET_COLUMN_CALCULATED_CACHED_AT_UPDATE'
      );
      expect(dispatcher.mock.calls[4][0].type).toEqual(
        'TOGGLE_TABLE_COLUMN_PANEL'
      );
    });
  });

  describe('clickLongitudinalTableColumnPanelApply', () => {
    let mockRequest;

    beforeEach(() => {
      const deferred = $.Deferred();
      mockRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve([]));
    });

    it('sends the correct data when adding a new longitudinal column', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        tableWidget: {
          appliedColumns: [],
          columnPanel: {
            isEditMode: false,
            name: 'Test Metric',
            dataSource: {
              type: 'TableMetric',
              source: 'Test',
              variable: 'Metric12',
            },
            calculation: 'mean',
            population: {
              applies_to_squad: true,
              position_groups: [],
              positions: [],
              athletes: [],
              all_squads: false,
              squads: [],
            },
            time_scope: {
              start_time: '',
              end_time: '',
              time_period: '',
              time_period_length: null,
            },
          },
          tableContainerId: 12,
          tableName: 'Table Name',
          tableType: 'LONGITUDINAL',
          showSummary: true,
          widgetId: 9876,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = clickLongitudinalTableColumnPanelApply();

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher.mock.calls).toHaveLength(5);
      expect(dispatcher.mock.calls[0][0].type).toEqual(
        'ADD_EDIT_TABLE_COLUMN_LOADING'
      );

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/table_containers/12/table_columns',
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': undefined,
        },
        data: JSON.stringify({
          name: 'Test Metric',
          data_source_type: 'TableMetric',
          input_params: {
            variable: 'Metric12',
            source: 'Test',
          },
          summary: 'mean',
          population: {
            applies_to_squad: true,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          element_config: {},
        }),
      });

      expect(dispatcher.mock.calls[1][0].type).toEqual(
        'ADD_TABLE_COLUMN_SUCCESS'
      );
      expect(fetchWidgetContent).toHaveBeenCalledTimes(1);
      expect(dispatcher.mock.calls[3][0].type).toEqual(
        'SET_COLUMN_CALCULATED_CACHED_AT_UPDATE'
      );
      expect(dispatcher.mock.calls[4][0].type).toEqual(
        'TOGGLE_TABLE_COLUMN_PANEL'
      );
    });

    it('sends the correct data when editing an existing longitudinal column', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        tableWidget: {
          appliedColumns: [{ id: 123, name: 'Test' }],
          columnPanel: {
            isEditMode: true,
            name: 'Edit Test',
            dataSource: {
              type: 'TableMetric',
              source: 'Test',
              variable: 'Metric12',
            },
            population: {
              applies_to_squad: false,
              position_groups: [],
              positions: [],
              athletes: [],
              all_squads: true,
              squads: [],
            },
            calculation: 'mean',
            time_scope: {
              time_period: 'today',
            },
            columnId: 123,
          },
          tableContainerId: 12,
          tableName: 'Table Name',
          tableType: 'LONGITUDINAL',
          widgetId: 9876,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = clickLongitudinalTableColumnPanelApply();

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher.mock.calls).toHaveLength(5);
      expect(dispatcher.mock.calls[0][0].type).toEqual(
        'ADD_EDIT_TABLE_COLUMN_LOADING'
      );

      expect(dispatcher.mock.calls[0][0].type).toEqual(
        'ADD_EDIT_TABLE_COLUMN_LOADING'
      );

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/table_containers/12/table_columns/123',
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': undefined,
        },
        data: JSON.stringify({
          name: 'Edit Test',
          data_source_type: 'TableMetric',
          input_params: {
            variable: 'Metric12',
            source: 'Test',
          },
          summary: 'mean',
          population: {
            applies_to_squad: false,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: true,
            squads: [],
          },
          element_config: {},
        }),
      });

      expect(dispatcher.mock.calls[1][0].type).toEqual(
        'EDIT_LONGITUDINAL_TABLE_COLUMN_SUCCESS'
      );
      expect(fetchWidgetContent).toHaveBeenCalledTimes(1);
      expect(dispatcher.mock.calls[3][0].type).toEqual(
        'SET_COLUMN_CALCULATED_CACHED_AT_UPDATE'
      );
      expect(dispatcher.mock.calls[4][0].type).toEqual(
        'TOGGLE_TABLE_COLUMN_PANEL'
      );
    });
  });

  describe('clickScorecardTableColumnPanelApply', () => {
    let mockRequest;

    beforeEach(() => {
      const deferred = $.Deferred();
      mockRequest = jest
        .spyOn($, 'ajax')
        .mockImplementation(() => deferred.resolve([]));
    });

    it('sends the correct data when adding a new scorecard column', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        tableWidget: {
          columnPanel: {
            isEditMode: false,
            name: 'Test Metric',
            dataSource: { name: 'Test Metric', key_name: 'Test|Metric12' },
            calculation: 'sum',
            population: {
              applies_to_squad: true,
              position_groups: [],
              positions: [],
              athletes: [],
              all_squads: false,
              squads: [],
            },
            time_scope: {
              start_time: '',
              end_time: '',
              time_period: 'today',
              time_period_length: null,
            },
          },
          tableContainerId: 12,
          tableName: 'Table Name',
          tableType: 'COMPARISON',
          showSummary: true,
          widgetId: 9876,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = clickScorecardTableColumnPanelApply();

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher.mock.calls).toHaveLength(4);
      expect(dispatcher.mock.calls[0][0].type).toEqual(
        'ADD_EDIT_TABLE_COLUMN_LOADING'
      );

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/table_containers/12/table_columns',
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': undefined,
        },
        data: JSON.stringify({
          population: {
            applies_to_squad: true,
            position_groups: [],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          time_scope: {
            start_time: '',
            end_time: '',
            time_period: 'today',
            time_period_length: null,
          },
        }),
      });

      expect(dispatcher.mock.calls[1][0].type).toEqual(
        'ADD_TABLE_COLUMN_SUCCESS'
      );
      expect(fetchWidgetContent).toHaveBeenCalledTimes(1);
      expect(dispatcher.mock.calls[3][0].type).toEqual(
        'TOGGLE_TABLE_COLUMN_PANEL'
      );
    });

    it('sends the correct data when editing an existing scorecard column', () => {
      const getState = jest.fn(() => ({
        dashboard: {
          activeDashboard: {
            id: 123,
            name: 'Dashboard',
          },
        },
        tableWidget: {
          columnPanel: {
            isEditMode: true,
            name: 'Edit Test',
            dataSource: { key_name: 'Test Metric' },
            calculation: 'mean',
            population: {
              applies_to_squad: false,
              position_groups: [123],
              positions: [],
              athletes: [],
              all_squads: false,
              squads: [],
            },
            time_scope: {
              time_period: 'today',
            },
            columnId: 123,
          },
          tableContainerId: 12,
          widgetId: 9876,
        },
        staticData: { containerType: 'AnalyticalDashboard' },
      }));

      const thunk = clickScorecardTableColumnPanelApply();

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(dispatcher.mock.calls).toHaveLength(4);
      expect(dispatcher.mock.calls[0][0].type).toEqual(
        'ADD_EDIT_TABLE_COLUMN_LOADING'
      );

      expect(mockRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/table_containers/12/table_columns/123',
        contentType: 'application/json',
        headers: {
          'X-CSRF-Token': undefined,
        },
        data: JSON.stringify({
          population: {
            applies_to_squad: false,
            position_groups: [123],
            positions: [],
            athletes: [],
            all_squads: false,
            squads: [],
          },
          time_scope: {
            time_period: 'today',
          },
        }),
      });

      expect(dispatcher.mock.calls[1][0].type).toEqual(
        'EDIT_SCORECARD_TABLE_COLUMN_SUCCESS'
      );
      expect(fetchWidgetContent).toHaveBeenCalledTimes(1);
      expect(dispatcher.mock.calls[3][0].type).toEqual(
        'TOGGLE_TABLE_COLUMN_PANEL'
      );
    });
  });

  describe('applyComparisonTableColumnFormula', () => {
    let mockPostRequest;
    let mockPutRequest;

    beforeEach(() => {
      mockPostRequest = jest
        .spyOn(axios, 'post')
        .mockReturnValue({ data: formulaColumnServerResponse });

      mockPutRequest = jest
        .spyOn(axios, 'put')
        .mockReturnValue({ data: formulaColumnServerResponse });
    });

    it('sends the correct data when adding a new formula column', async () => {
      const getState = jest.fn(() => ({
        columnFormulaPanel: structuredClone(COLUMN_FORMULA_PANEL_STATE),
      }));

      const thunk = applyComparisonTableColumnFormula(ACTIVE_FORMULA_MOCK);

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(mockPostRequest).toHaveBeenCalledWith(
        '/table_containers/12/table_columns',
        ADD_FORMULA_COLUMN_MOCK
      );

      await waitFor(() => {
        expect(dispatcher.mock.calls).toHaveLength(6);
      });

      expect(dispatcher.mock.calls[0][0].type).toEqual(
        `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/setLoading`
      );

      expect(dispatcher.mock.calls[1][0].type).toEqual(
        'ADD_TABLE_COLUMN_SUCCESS'
      );
      expect(dispatcher.mock.calls[3][0].type).toEqual(
        `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/setLoading`
      );
      expect(fetchWidgetContent).toHaveBeenCalledTimes(1);
      expect(dispatcher.mock.calls[4][0].type).toEqual(
        'TOGGLE_TABLE_COLUMN_FORMULA_PANEL'
      );
      expect(dispatcher.mock.calls[5][0].type).toEqual(
        `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/reset`
      );
    });

    it('sends the correct data when editing an existing formula column', async () => {
      const getState = jest.fn(() => ({
        columnFormulaPanel: {
          ...structuredClone(COLUMN_FORMULA_PANEL_STATE),
          isEditMode: true,
          columnId: 2,
        },
      }));

      const thunk = applyComparisonTableColumnFormula(ACTIVE_FORMULA_MOCK);

      const dispatcher = jest.fn();
      thunk(dispatcher, getState);

      expect(mockPutRequest).toHaveBeenCalledWith(
        '/table_containers/12/table_columns/2',
        ADD_FORMULA_COLUMN_MOCK
      );

      await waitFor(() => {
        expect(dispatcher.mock.calls).toHaveLength(6);
      });

      expect(dispatcher.mock.calls[0][0].type).toEqual(
        `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/setLoading`
      );

      expect(dispatcher.mock.calls[1][0].type).toEqual(
        'EDIT_COMPARISON_TABLE_COLUMN_SUCCESS'
      );
      expect(fetchWidgetContent).toHaveBeenCalledTimes(1);

      expect(dispatcher.mock.calls[3][0].type).toEqual(
        `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/setLoading`
      );

      expect(dispatcher.mock.calls[4][0].type).toEqual(
        'TOGGLE_TABLE_COLUMN_FORMULA_PANEL'
      );
      expect(dispatcher.mock.calls[5][0].type).toEqual(
        `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/reset`
      );
    });

    it('has the correct action SET_TABLE_COLUMN_EVENT_TYPE', () => {
      const expectedAction = {
        type: 'SET_TABLE_COLUMN_EVENT_TYPE',
        payload: {
          event: 'testEvent',
          type: 'EventActivity',
        },
      };

      expect(setTableColumnEventType('testEvent', 'EventActivity')).toEqual(
        expectedAction
      );
    });

    it('has the correct action SET_TABLE_ROW_EVENT_TYPE', () => {
      const expectedAction = {
        type: 'SET_TABLE_ROW_EVENT_TYPE',
        payload: {
          event: 'testEvent',
          type: 'EventActivity',
        },
      };

      expect(setTableRowEventType('testEvent', 'EventActivity')).toEqual(
        expectedAction
      );
    });

    it('has the correct action SET_COLUMN_PANEL_INPUT_PARAMS', () => {
      const expectedAction = {
        type: 'SET_COLUMN_PANEL_INPUT_PARAMS',
        payload: {
          params: {
            type: 'metric',
          },
        },
      };

      expect(setColumnPanelInputParams({ type: 'metric' })).toEqual(
        expectedAction
      );
    });

    it('has the correct action SET_ROW_PANEL_INPUT_PARAMS', () => {
      const expectedAction = {
        type: 'SET_ROW_PANEL_INPUT_PARAMS',
        payload: {
          params: {
            type: 'availability',
          },
        },
      };

      expect(setRowPanelInputParams({ type: 'availability' })).toEqual(
        expectedAction
      );
    });
  });
});
