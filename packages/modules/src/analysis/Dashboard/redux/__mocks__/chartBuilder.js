// @flow
import _uniqueId from 'lodash/uniqueId';
import { EMPTY_SELECTION } from '@kitman/components/src/Athletes/constants';
import { AGGREGATE_PERIOD } from '@kitman/modules/src/analysis/shared/components/XYChart/constants';
import { TIME_PERIODS } from '@kitman/modules/src/analysis/shared/constants';
import {
  REDUCER_KEY,
  defaultDataSourceSidePanel,
  type ChartBuilderState,
} from '../slices/chartBuilder';
import type {
  ChartWidgetData,
  ChartWidgetType,
} from '../../components/ChartWidget/types';
import type { ChartElement } from '../../../shared/types/charts';

type ChartElementShape = $Shape<ChartElement>;
export const generateChartElement = (
  partialChartElement?: ChartElementShape = {}
): ChartElement => ({
  id: _uniqueId(),
  calculation: 'count',
  config: null,
  data_source_type: 'Medical',
  input_params: { id: _uniqueId(), type: '' },
  population: {
    ...EMPTY_SELECTION,
  },
  time_scope: {},
  ...partialChartElement,
});

type ChartWidgetShape = $Shape<ChartWidgetType>;
export const generateChartWidget = (
  partialChartWidget?: ChartWidgetShape = {}
): ChartWidgetType => ({
  id: _uniqueId(),
  name: 'Widget Name',
  chart_id: _uniqueId(),
  chart_type: 'value',
  chart_elements: [],
  ...partialChartWidget,
});

type ChartWidgetDataShape = $Shape<ChartWidgetData>;
export const generateChartWidgetData = (
  partialChartWidgetData?: ChartWidgetDataShape = {}
): ChartWidgetData => ({
  id: _uniqueId(),
  rows: 3,
  cols: 6,
  vertical_position: 5,
  horizontal_position: 0,
  print_rows: 3,
  print_cols: 5,
  print_vertical_position: 5,
  print_horizontal_position: 1,
  rows_range: [2, 5],
  cols_range: [2, 6],
  widget_type: 'chart',
  widget: generateChartWidget(),
  widget_render: generateChartWidget(),
  ...partialChartWidgetData,
});

export const MOCK_CHART_BUILDER: ChartBuilderState = {
  newChartModal: {
    isOpen: false,
  },
  activeWidgets: {},
  dataSourceSidePanel: {
    ...defaultDataSourceSidePanel,
  },
  chartFormattingPanel: {
    isOpen: false,
    appliedFormat: [],
  },
};

export const MOCK_GROUPINGS = [
  { name: 'TableMetric', groupings: ['grouping_a', 'micro_cycle'] },
  { name: 'MedicalInjury', groupings: ['grouping_c'] },
];

export const MOCK_CATEGORIZED_GROUPINGS = [
  {
    name: 'TableMetric',
    groupings: [
      {
        key: 'grouping_a',
        name: 'Athlete',
        category: 'population',
        category_name: 'Population',
        order: 1,
        category_order: 1,
      },
      {
        key: 'micro_cycle',
        name: 'Week of Training',
        category: 'timestamp',
        category_name: 'Time',
        order: 2,
        category_order: 2,
      },
      {
        key: 'drill',
        name: 'Drill',
        category: 'event',
        category_name: 'Events',
        order: 10,
        category_order: 3,
      },
    ],
  },
  {
    name: 'MedicalInjury',
    groupings: [
      {
        key: 'body_area',
        name: 'Body Area',
        category: 'medical',
        category_name: 'medical',
        order: 2,
        category_order: 1,
      },
    ],
  },
];

export const MOCK_CHART_ELEMENTS = [
  {
    id: 1,
    data_source_type: 'TableMetric',
    input_params: {},
    calculation: 'sum',
    overlays: null,
    population: {
      applies_to_squad: false,
      all_squads: false,
      position_groups: [],
      positions: [],
      athletes: [1, 2],
      squads: [],
      context_squads: [],
    },
    time_scope: {
      time_period: TIME_PERIODS.today,
      config: {},
    },
    config: {
      groupings: ['grouping_a'],
      filters: {
        training_session_ids: [1],
      },
      render_options: {
        name: 'New Chart Element',
        type: 'bar',
        stack_group_elements: true,
        axis_config: 'left',
      },
    },
  },
  {
    id: 2,
    data_source_type: 'activity',
    input_params: {},
    calculation: 'mean',
    overlays: null,
    population: {
      applies_to_squad: false,
      all_squads: false,
      position_groups: [],
      positions: [1],
      athletes: [],
      squads: [],
      context_squads: [],
    },
    time_scope: {
      time_period: TIME_PERIODS.thisSeason,
    },
    config: {
      render_options: {
        name: 'New Chart Element 2',
        axis_config: 'right',
      },
    },
  },
];

export const MOCK_PIE_CHART_ELEMENTS = [
  {
    id: 1,
    data_source_type: 'TableMetric',
    input_params: {},
    calculation: 'sum',
    overlays: null,
    population: {
      applies_to_squad: false,
      all_squads: false,
      position_groups: [],
      positions: [],
      athletes: [1, 2],
      squads: [],
      context_squads: [],
    },
    time_scope: {
      time_period: TIME_PERIODS.today,
    },
    config: {
      groupings: ['athlete'],
      filters: {
        training_session_ids: [1],
      },
      render_options: {
        name: 'New Pie Chart Element',
        type: 'pie',
      },
    },
  },
];

export const MOCK_DATA_SOURCE_SIDE_PANEL = {
  isOpen: true,
  widgetId: '1',
  chartId: 1,
  sidePanelSource: 'metric',
  dataSourceFormState: {
    mode: 'create',
    ...MOCK_CHART_ELEMENTS[0],
  },
};

export const MOCK_STATE = {
  [REDUCER_KEY]: MOCK_CHART_BUILDER,
};

export const MOCK_STATE_WITH_DATA = {
  [REDUCER_KEY]: {
    ...MOCK_CHART_BUILDER,
    groupings: MOCK_GROUPINGS,
    dataSourceSidePanel: {
      ...MOCK_DATA_SOURCE_SIDE_PANEL,
    },
    '123': {
      config: {
        aggregate_period: { '1': AGGREGATE_PERIOD.monthly },
        chartOptions: { hide_null_values: true },
        sortConfig: { sortBy: 1, sortOrder: 'A-Z' },
      },
    },
  },
};

export const MOCK_STATE_PREVIEW_DATA = {
  [REDUCER_KEY]: {
    ...MOCK_CHART_BUILDER,
    activeWidgets: {
      '1': {
        id: 1,
        widget: {
          id: 1,
          name: 'Widget Name',
          chart_type: 'value',
          chart_elements: [],
        },
      },
    },
    dataSourceSidePanel: {
      ...MOCK_DATA_SOURCE_SIDE_PANEL,
      previewData: {
        ...MOCK_CHART_ELEMENTS[0],
      },
    },
  },
};

export const MOCK_CHART_ELEMENT_SERVER_RESPONSE = {
  id: 20,
  chart_id: 38,
  population: {
    applies_to_squad: false,
    all_squads: false,
    athletes: [],
    positions: [],
    position_groups: [],
    squads: [8],
    context_squads: [],
    users: [],
  },
  data_source_type: 'TableMetric',
  input_params: {
    source: 'kitman',
    variable: 'game_minutes',
  },
  calculation: 'mean',
  filters: null,
  config: null,
  created_at: '2024-03-18T11:23:45.524+00:00',
  updated_at: '2024-03-18T11:23:45.524+00:00',
  time_scope: {
    id: 230667,
    time_scopeable_type: 'Charts::Private::Models::ChartElement',
    time_scopeable_id: 20,
    time_period: TIME_PERIODS.lastXDays,
    start_time: null,
    end_time: null,
    time_period_length: 365,
    time_period_length_offset: null,
    config: null,
    created_at: '2024-03-18T11:23:45.000+00:00',
    updated_at: '2024-03-18T11:23:45.000+00:00',
  },
};

export const MOCK_LARGE_PIE_DATA_SET = [
  { label: 'Openside Flanker', value: '1000' },
  { label: 'Blindside Flanker', value: '1000' },
  { label: 'Wing', value: '800' },
  { label: 'Loose-head Prop', value: '800' },
  { label: 'Tight-head Prop', value: '600' },
  { label: 'Hooker', value: '600' },
  { label: 'Inside Center', value: '500' },
  { label: 'No 8', value: '500' },
  { label: 'Other', value: '500' },
  { label: 'Out Half', value: '250' },
  { label: 'Fullback', value: '150' },
];
