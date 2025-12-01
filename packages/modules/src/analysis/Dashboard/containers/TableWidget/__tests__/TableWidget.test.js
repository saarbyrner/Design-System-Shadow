import { render } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { data as formulaColumnServerResponse } from '@kitman/services/src/mocks/handlers/analysis/addTableFormulaColumn';
import { TABLE_WIDGET_DATA_SOURCES } from '@kitman/modules/src/analysis/Dashboard/components/TableWidget/types';
import {
  useGetPermissionsQuery,
  useGetAllGroupsQuery,
  useGetAllLabelsQuery,
  useGetAllSquadAthletesQuery,
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';
import {
  openTableColumnPanel,
  openTableColumnFormulaPanel,
  editComparisonTableColumn,
  editScorecardTableColumn,
  editLongitudinalTableColumn,
  openTableRowPanel,
  editTableRow,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel';
import {
  openTableColumnFormattingPanel,
  openScorecardTableFormattingPanel,
} from '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget';
import { setupFormulaPanel } from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';
import { emptySquadAthletes } from '@kitman/modules/src/analysis/Dashboard/components/utils';
import TableWidgetContainer from '../index';

jest.mock('@kitman/common/src/hooks/useEventTracking', () => () => ({
  trackEvent: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard',
  () => ({
    useGetPermissionsQuery: jest.fn(),
    useGetAllGroupsQuery: jest.fn(),
    useGetAllLabelsQuery: jest.fn(),
    useGetAllSquadAthletesQuery: jest.fn(),
    useGetPermittedSquadsQuery: jest.fn(),
    useGetSquadAthletesQuery: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget/panel',
  () => ({
    openTableColumnPanel: jest.fn(),
    openTableColumnFormulaPanel: jest.fn(),
    editComparisonTableColumn: jest.fn(),
    editScorecardTableColumn: jest.fn(),
    editLongitudinalTableColumn: jest.fn(),
    openTableRowPanel: jest.fn(),
    editTableRow: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/actions/tableWidget',
  () => ({
    openTableColumnFormattingPanel: jest.fn(),
    openScorecardTableFormattingPanel: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice',
  () => ({
    setupFormulaPanel: jest.fn(),
  })
);
jest.mock(
  '@kitman/modules/src/analysis/Dashboard/components/TableWidget',
  () => ({
    TableWidgetTranslated: jest.fn(() => <div data-testid="table-widget" />),
  })
);

const mockDispatch = jest.fn();

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => state,
});

describe('TableWidget Container', () => {
  const containerProps = {
    appliedColumnDetails: [],
    appliedRowDetails: [],
    squadAthletes: emptySquadAthletes,
  };

  const defaultStore = {
    dashboard: {
      activeDashboard: { id: 1 },
    },
    tableWidget: {
      appliedColumns: [],
      appliedRows: [],
      columnPanel: {
        source: null,
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
        },
      },
      rowPanel: {
        source: null,
        calculation: '',
        isEditMode: false,
        metricId: null,
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
        },
      },
      formattingPanel: {
        columnId: null,
        columnName: null,
        columnUnit: null,
        widgetId: null,
        appliedFormat: [],
      },
      showSummary: false,
      tableContainerId: null,
      tableName: '',
      tableType: '',
      widgetId: null,
    },
    staticData: {
      containerType: 'AnalyticalDashboard',
      canManageDashboard: true,
    },
    dashboardApi: {},
  };

  const renderComponent = (state = defaultStore, props = {}) =>
    render(
      <I18nextProvider i18n={i18n}>
        <Provider store={storeFake(state)}>
          <TableWidgetContainer {...props} />
        </Provider>
      </I18nextProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockClear();

    useGetPermissionsQuery.mockReturnValue({
      data: { analysis: { labelsAndGroups: { canReport: false } } },
      isSuccess: true,
    });
    useGetAllGroupsQuery.mockReturnValue({
      data: [],
      isFetching: false,
    });
    useGetAllLabelsQuery.mockReturnValue({
      data: [],
      isFetching: false,
    });
    useGetAllSquadAthletesQuery.mockReturnValue({
      data: { squads: [] },
      isFetching: false,
    });
    useGetPermittedSquadsQuery.mockReturnValue({
      data: [],
    });
    useGetSquadAthletesQuery.mockReturnValue({
      data: { position_groups: [] },
    });
  });

  const getComponentProps = () => {
    const { TableWidgetTranslated } = jest.requireMock(
      '@kitman/modules/src/analysis/Dashboard/components/TableWidget'
    );
    return TableWidgetTranslated.mock.calls[0][0];
  };

  it('dispatches the correct action when onClickAddColumn is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onClickAddColumn({
      source: TABLE_WIDGET_DATA_SOURCES.metric,
      sourceSubtypeId: undefined,
      widgetId: 9,
      existingTableColumns: [],
      existingTableRows: [],
      tableContainerId: 123,
      tableName: 'Table',
      tableType: 'SCORECARD',
      showSummary: false,
    });

    expect(openTableColumnPanel).toHaveBeenCalledWith(
      TABLE_WIDGET_DATA_SOURCES.metric,
      9,
      [],
      [],
      123,
      'Table',
      'SCORECARD',
      false
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('dispatches the correct action when onClickAddColumn for a formula is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onClickAddColumn({
      source: TABLE_WIDGET_DATA_SOURCES.formula,
      sourceSubtypeId: 1,
      widgetId: 9,
      existingTableColumns: [],
      existingTableRows: [],
      tableContainerId: 123,
      tableName: 'Table',
      tableType: 'COMPARISON',
      showSummary: false,
    });

    expect(openTableColumnFormulaPanel).toHaveBeenCalled();
    expect(setupFormulaPanel).toHaveBeenCalledWith({
      formulaId: 1,
      widgetType: 'COMPARISON',
      widgetId: 9,
      tableContainerId: 123,
    });
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('dispatches the correct action when onClickAddRow is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onClickAddRow('metric', 27, [], [], 123, 'Table', 'COMPARISON', true);

    expect(openTableRowPanel).toHaveBeenCalledWith(
      'metric',
      27,
      [],
      [],
      123,
      'Table',
      'COMPARISON',
      true
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('dispatches the correct action when onClickEditComparisonColumn is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onClickEditComparisonColumn(
      11,
      [],
      9,
      {
        columnId: 1,
        isEditMode: true,
        name: 'Test Column',
      },
      'COMPARISON'
    );

    expect(editComparisonTableColumn).toHaveBeenCalledWith(
      11,
      [],
      9,
      {
        columnId: 1,
        isEditMode: true,
        name: 'Test Column',
      },
      'COMPARISON'
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('dispatches the correct action when onClickEditComparisonColumn for a formula is called', () => {
    renderComponent(defaultStore, containerProps);

    const columnDetails = formulaColumnServerResponse;

    const props = getComponentProps();
    props.onClickEditComparisonColumn(11, [], 9, columnDetails, 'COMPARISON');

    expect(openTableColumnFormulaPanel).toHaveBeenCalledTimes(1);
    expect(setupFormulaPanel).toHaveBeenCalledWith({
      formulaId: 2,
      widgetType: 'COMPARISON',
      widgetId: 11,
      tableContainerId: 9,
      columnDetails,
    });
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('dispatches the correct action when onClickEditScorecardColumn is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onClickEditScorecardColumn(
      11,
      [],
      9,
      {
        columnId: 1,
        isEditMode: true,
        name: 'Test Column',
      },
      'SCORECARD'
    );

    expect(editScorecardTableColumn).toHaveBeenCalledWith(
      11,
      [],
      9,
      {
        columnId: 1,
        isEditMode: true,
        name: 'Test Column',
      },
      'SCORECARD'
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('dispatches the correct action when onClickEditLongitudinalColumn is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onClickEditLongitudinalColumn(
      11,
      [],
      9,
      {
        columnId: 1,
        isEditMode: true,
        name: 'Test Column',
      },
      'LONGITUDINAL'
    );

    expect(editLongitudinalTableColumn).toHaveBeenCalledWith(
      11,
      [],
      9,
      {
        columnId: 1,
        isEditMode: true,
        name: 'Test Column',
      },
      'LONGITUDINAL'
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('dispatches the correct action when onClickFormatColumn is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onClickFormatColumn(
      [{ id: 300, name: 'Test Column', config: null }],
      123,
      'COMPARISON',
      999,
      300,
      'Test Column',
      null,
      []
    );

    expect(openTableColumnFormattingPanel).toHaveBeenCalledWith(
      [{ id: 300, name: 'Test Column', config: null }],
      123,
      'COMPARISON',
      999,
      300,
      'Test Column',
      null,
      []
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('dispatches the correct action when onClickFormatScorecardRow is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onClickFormatScorecardRow(
      [{ id: 300, name: 'Test Metric', config: null }],
      123,
      999,
      300,
      'Test Metric',
      null,
      []
    );

    expect(openScorecardTableFormattingPanel).toHaveBeenCalledWith(
      [{ id: 300, name: 'Test Metric', config: null }],
      123,
      999,
      300,
      'Test Metric',
      null,
      []
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });

  it('dispatches the correct action when onClickEditRow is called', () => {
    renderComponent(defaultStore, containerProps);

    const props = getComponentProps();
    props.onClickEditRow({ id: 2, name: 'Fatigue' }, 123, 'SCORECARD', 9);

    expect(editTableRow).toHaveBeenCalledWith(
      { id: 2, name: 'Fatigue' },
      123,
      'SCORECARD',
      9
    );
    expect(mockDispatch).toHaveBeenCalledTimes(1);
  });
});
