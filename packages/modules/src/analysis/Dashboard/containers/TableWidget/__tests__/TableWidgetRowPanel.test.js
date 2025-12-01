import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { emptySquadAthletes } from '@kitman/modules/src/analysis/Dashboard/components/utils';
import {
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
  useGetMetricVariablesQuery,
  useGetAllSquadAthletesQuery,
  useGetActiveSquadQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import TableWidgetRowPanelContainer from '../RowPanel';

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard',
  () => ({
    useGetPermittedSquadsQuery: jest.fn(),
    useGetSquadAthletesQuery: jest.fn(),
    useGetMetricVariablesQuery: jest.fn(),
    useGetAllSquadAthletesQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/RowPanel',
  () => ({
    RowPanelTranslated: jest.fn(() => <div data-testid="row-panel" />),
  })
);

const mockDispatch = jest.fn();

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => ({ ...state }),
});

const containerProps = {
  availableVariables: [],
  squadAthletes: emptySquadAthletes,
  turnaroundList: [],
};

const defaultStore = {
  dashboard: {
    isTableRowPanelOpen: true,
  },
  dashboardApi: {},
  tableWidget: {
    tableId: null,
    appliedColumns: [],
    appliedRows: [],
    tableContainerId: null,
    widgetId: null,
    columnPanel: {
      columnId: null,
      isEditMode: false,
      tableContainerId: null,
      name: '',
      metrics: [],
      calculation: '',
      time_scope: {
        time_period: '',
        start_time: undefined,
        end_time: undefined,
        time_period_length: undefined,
      },
    },
    rowPanel: {
      rowId: null,
      isEditMode: false,
      calculation: '',
      calculation_params: {},
      metrics: [],
      population: {
        applies_to_squad: false,
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
        time_period_length_offset: undefined,
      },
      dataSource: {
        name: null,
      },
      isLoading: false,
      filters: {},
      source: null,
      config: null,
    },
    formattingPanel: {
      columnId: null,
      columnName: null,
      columnUnit: null,
      widgetId: null,
      appliedFormat: [],
    },
    tableName: '',
    tableType: 'COMPARISON',
  },
  coachingPrinciples: {
    enabled: true,
  },
};

const renderComponent = (storeState = defaultStore) => {
  const store = storeFake(storeState);

  return render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <TableWidgetRowPanelContainer {...containerProps} />
      </Provider>
    </I18nextProvider>
  );
};

describe('TableWidgetRowPanel Container', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockClear();

    useGetActiveSquadQuery.mockReturnValue({
      data: { id: null },
    });

    useGetSquadAthletesQuery.mockReturnValue({
      data: { position_groups: [] },
    });

    useGetPermittedSquadsQuery.mockReturnValue({
      data: [],
    });

    useGetMetricVariablesQuery.mockReturnValue({
      data: [],
    });

    useGetAllSquadAthletesQuery.mockReturnValue({
      data: { squads: [] },
      isFetching: false,
    });
  });

  const getComponentProps = () => {
    const { RowPanelTranslated } = jest.requireMock(
      '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/RowPanel'
    );
    return RowPanelTranslated.mock.calls[0][0];
  };

  it('dispatches the correct action when onSetCalculation is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.onSetCalculation('mean');

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_ROW_CALCULATION',
      payload: {
        calculation: 'mean',
      },
    });
  });

  it('dispatches the correct action when onSetCalculationParam is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.onSetCalculationParam('accute', 5);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_ROW_CALCULATION_PARAM',
      payload: {
        calculationParam: 'accute',
        value: 5,
      },
    });
  });

  it('dispatches the correct action when onSetDateRange is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.onSetDateRange({
      start_date: '2019-01-29T00:00:00.000+00:00',
      end_date: '2020-01-30T23:59:59.000+00:00',
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_ROW_DATE_RANGE',
      payload: {
        range: {
          start_date: '2019-01-29T00:00:00.000+00:00',
          end_date: '2020-01-30T23:59:59.000+00:00',
        },
      },
    });
  });

  it('dispatches the correct action when onSetMetrics is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.onSetMetrics([{ key_name: 'RPE' }]);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_ROW_METRICS',
      payload: {
        metric: [{ key_name: 'RPE' }],
      },
    });
  });

  it('dispatches the correct action when onSetTimePeriod is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.onSetTimePeriod('this_season');

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_ROW_TIME_PERIOD',
      payload: {
        timePeriod: 'this_season',
      },
    });
  });

  it('dispatches the correct action when onSetTimePeriodLength is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.onSetTimePeriodLength(4);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_ROW_TIME_PERIOD_LENGTH',
      payload: {
        timePeriodLength: 4,
      },
    });
  });

  it('dispatches the correct action when onSetTimePeriodLengthOffset is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.onSetTimePeriodLengthOffset(20);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_ROW_TIME_PERIOD_LENGTH_OFFSET',
      payload: {
        timePeriodLengthOffset: 20,
      },
    });
  });

  it('dispatches the correct action when togglePanel is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.togglePanel();

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_TABLE_ROW_PANEL',
    });
  });

  it('dispatches the correct action when onSetRowTitle is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.onSetRowTitle('title');

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_ROW_TITLE',
      payload: {
        title: 'title',
      },
    });
  });
});
