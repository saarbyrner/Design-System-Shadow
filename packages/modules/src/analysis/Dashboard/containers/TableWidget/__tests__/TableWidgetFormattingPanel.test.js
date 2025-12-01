import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { colors } from '@kitman/common/src/variables';
import TableWidgetFormattingPanelContainer from '../FormattingPanel';

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/components/FormattingPanel',
  () => ({
    FormattingPanelTranslated: jest.fn(() => (
      <div data-testid="formatting-panel" />
    )),
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
  canViewMetrics: false,
};

const defaultStore = {
  dashboard: {
    isTableFormattingPanelOpen: true,
  },
  dashboardApi: {},
  tableWidget: {
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
    formattingPanel: {
      formattableId: null,
      panelName: null,
      ruleUnit: null,
      appliedFormat: [],
    },
    tableContainerId: null,
    tableType: 'COMPARISON',
    tableName: '',
    widgetId: null,
  },
  staticData: {
    canViewMetrics: false,
  },
  injuryRiskMetrics: {
    isLoading: false,
    hasErrored: false,
    metrics: [],
  },
};

const renderComponent = (storeState = defaultStore) => {
  const store = storeFake(storeState);

  return render(
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <TableWidgetFormattingPanelContainer {...containerProps} />
      </Provider>
    </I18nextProvider>
  );
};

describe('TableWidgetFormattingPanel Container', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockDispatch.mockClear();
  });

  const getComponentProps = () => {
    const { FormattingPanelTranslated } = jest.requireMock(
      '@kitman/modules/src/analysis/Dashboard/components/FormattingPanel'
    );
    return FormattingPanelTranslated.mock.calls[0][0];
  };

  it('dispatches the correct action when togglePanel is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.togglePanel();

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_TABLE_FORMATTING_PANEL',
    });
  });

  it('dispatches the correct action when onAddFormattingRule is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.onAddFormattingRule();

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'ADD_FORMATTING_RULE',
    });
  });

  it('dispatches the correct action when onRemoveFormattingRule is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.onRemoveFormattingRule(1);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'REMOVE_FORMATTING_RULE',
      payload: { index: 1 },
    });
  });

  it('dispatches the correct action when onUpdateRuleType is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.onUpdateRuleType('numeric', 1);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_FORMATTING_RULE_TYPE',
      payload: { type: 'numeric', index: 1 },
    });
  });

  it('dispatches the correct action when onUpdateRuleCondition is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.onUpdateRuleCondition('less_than', 1);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_FORMATTING_RULE_CONDITION',
      payload: { condition: 'less_than', index: 1 },
    });
  });

  it('dispatches the correct action when onUpdateRuleValue is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.onUpdateRuleValue(430, 1);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_FORMATTING_RULE_VALUE',
      payload: { value: 430, index: 1 },
    });
  });

  it('dispatches the correct action when onUpdateRuleColor is called', () => {
    renderComponent();

    const props = getComponentProps();
    props.onUpdateRuleColor(colors.black_100, 1);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'UPDATE_FORMATTING_RULE_COLOR',
      payload: { color: colors.black_100, index: 1 },
    });
  });
});
