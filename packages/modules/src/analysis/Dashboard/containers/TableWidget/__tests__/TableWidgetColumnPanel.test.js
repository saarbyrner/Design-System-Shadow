import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import {
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
  useGetMetricVariablesQuery,
  useGetActiveSquadQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import TableWidgetColumnPanelContainer from '../ColumnPanel';

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard',
  () => ({
    useGetPermittedSquadsQuery: jest.fn(),
    useGetSquadAthletesQuery: jest.fn(),
    useGetMetricVariablesQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ColumnPanel',
  () => ({
    ColumnPanelTranslated: jest.fn(() => <div data-testid="column-panel" />),
  })
);

const mockDispatch = jest.fn();

describe('TableWidgetColumnPanel Container', () => {
  const containerProps = {
    availableVariables: [],
    turnaroundList: [],
  };

  const defaultStore = {
    dashboard: {
      isTableColumnPanelOpen: true,
    },
    dashboardApi: {},
    tableWidget: {
      tableId: null,
      appliedColumns: [],
      appliedPopulation: {
        applies_to_squad: false,
        position_groups: [],
        positions: [],
        athletes: [],
        all_squads: false,
        squads: [],
      },
      columnPanel: {
        columnId: null,
        isEditMode: false,
        name: '',
        metrics: [],
        population: {
          applies_to_squad: false,
          position_groups: [],
          positions: [],
          athletes: [],
          all_squads: false,
          squads: [],
        },
        calculation: '',
        time_scope: {
          time_period: '',
          start_time: undefined,
          end_time: undefined,
          time_period_length: undefined,
          time_period_length_offset: undefined,
        },
        filters: {
          time_loss: [],
          competitions: [],
          event_types: [],
          session_type: [],
          training_session_types: [],
        },
      },
      formattingPanel: {
        columnId: null,
        columnName: null,
        columnUnit: null,
        widgetId: null,
        appliedFormat: [],
      },
      tableContainerId: null,
      tableName: '',
      widgetId: null,
    },
    coachingPrinciples: {
      enabled: true,
    },
  };

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: mockDispatch,
    getState: () => state,
  });

  const renderComponent = (state = defaultStore, props = {}) =>
    render(
      <I18nextProvider i18n={i18n}>
        <Provider store={storeFake(state)}>
          <TableWidgetColumnPanelContainer {...props} />
        </Provider>
      </I18nextProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockClear();

    useGetPermittedSquadsQuery.mockReturnValue({
      data: [],
    });
    useGetSquadAthletesQuery.mockReturnValue({
      data: { position_groups: [] },
    });
    useGetMetricVariablesQuery.mockReturnValue({
      data: [],
    });
    useGetActiveSquadQuery.mockReturnValue({
      data: null,
    });
  });

  const getComponentProps = () => {
    const { ColumnPanelTranslated } = jest.requireMock(
      '@kitman/modules/src/analysis/Dashboard/components/TableWidget/components/ColumnPanel'
    );
    return ColumnPanelTranslated.mock.calls[0][0];
  };

  it('dispatches the correct action when onSetCalculation is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onSetCalculation('mean');

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_COLUMN_CALCULATION',
      payload: {
        calculation: 'mean',
      },
    });
  });

  it('dispatches the correct action when onSetCalculationParam is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onSetCalculationParam('accute', 5);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_COLUMN_CALCULATION_PARAM',
      payload: {
        calculationParam: 'accute',
        value: 5,
      },
    });
  });

  it('dispatches the correct action when onSetDateRange is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onSetDateRange({
      start_date: '2019-01-29T00:00:00.000+00:00',
      end_date: '2020-01-30T23:59:59.000+00:00',
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_COLUMN_DATE_RANGE',
      payload: {
        range: {
          start_date: '2019-01-29T00:00:00.000+00:00',
          end_date: '2020-01-30T23:59:59.000+00:00',
        },
      },
    });
  });

  it('dispatches the correct action when onSetColumnTitle is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onSetColumnTitle('RPE x Duration');

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_COLUMN_TITLE',
      payload: {
        title: 'RPE x Duration',
      },
    });
  });

  it('dispatches the correct action when onSetTimePeriod is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onSetTimePeriod('this_season');

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_COLUMN_TIME_PERIOD',
      payload: {
        timePeriod: 'this_season',
      },
    });
  });

  it('dispatches the correct action when onSetTimePeriodLength is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onSetTimePeriodLength(4);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_COLUMN_TIME_PERIOD_LENGTH',
      payload: {
        timePeriodLength: 4,
      },
    });
  });

  it('dispatches the correct action when onSetTimePeriodLengthOffset is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onSetTimePeriodLengthOffset(20);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_TABLE_COLUMN_TIME_PERIOD_LENGTH_OFFSET',
      payload: {
        timePeriodLengthOffset: 20,
      },
    });
  });

  it('dispatches the correct action when togglePanel is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.togglePanel();

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_TABLE_COLUMN_PANEL',
    });
  });
});
