import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtuosoMockContext } from 'react-virtuoso';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import structuredClone from 'core-js/stable/structured-clone';
import i18n from '@kitman/common/src/utils/i18n';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import {
  useGetPermittedSquadsQuery,
  useGetSquadAthletesQuery,
  useGetMetricVariablesQuery,
} from '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard';

import {
  REDUCER_KEY as COLUMN_FORMULA_PANEL_REDUCER_KEY,
  initialTableWidgetFormulaInput as initialInput,
} from '@kitman/modules/src/analysis/Dashboard/redux/slices/columnFormulaPanelSlice';
// eslint-disable-next-line jest/no-mocks-import
import { COLUMN_FORMULA_PANEL_STATE } from '@kitman/modules/src/analysis/Dashboard/redux/__mocks__/tableWidget';
import ColumnFormulaPanelContainer from '@kitman/modules/src/analysis/Dashboard/containers/TableWidget/ColumnFormulaPanel';

jest.mock(
  '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard',
  () => ({
    ...jest.requireActual(
      '@kitman/modules/src/analysis/Dashboard/redux/services/dashboard'
    ),
    useGetPermittedSquadsQuery: jest.fn(),
    useGetSquadAthletesQuery: jest.fn(),
    useGetMetricVariablesQuery: jest.fn(),
  })
);

const mockDispatch = jest.fn();

const defaultState = {
  dashboard: {
    activeDashboard: { id: 123 },
    isTableColumnFormulaPanelOpen: true,
  },
  dashboardApi: {
    queries: {},
    mutations: {},
    provided: {},
    subscriptions: {},
    config: {
      online: true,
      focused: true,
      middlewareRegistered: true,
      refetchOnFocus: false,
      refetchOnReconnect: false,
      refetchOnMountOrArgChange: false,
      keepUnusedDataFor: 60,
      reducerPath: 'dashboardApi',
    },
  },
  [COLUMN_FORMULA_PANEL_REDUCER_KEY]: {
    ...structuredClone(COLUMN_FORMULA_PANEL_STATE),
    progressStep: 1, // Set as second step
  },
};

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => state,
});

const renderComponent = (state = defaultState) =>
  render(
    <I18nextProvider i18n={i18n}>
      <Provider store={storeFake(state)}>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
          <VirtuosoMockContext.Provider
            value={{ viewportHeight: 10000, itemHeight: 50 }}
          >
            <ColumnFormulaPanelContainer />
          </VirtuosoMockContext.Provider>
        </LocalizationProvider>
      </Provider>
    </I18nextProvider>
  );

describe('Analytical Dashboard <ColumnFormulaPanel /> container', () => {
  beforeEach(() => {
    window.setFlag('table-widget-activity-source', true);
    window.setFlag('table-widget-complex-calculations', true);

    useGetSquadAthletesQuery.mockReturnValue({
      data: { position_groups: [] },
      isLoading: false,
      isFetching: false,
      isSuccess: true,
    });
    useGetPermittedSquadsQuery.mockReturnValue({
      data: [
        { id: 1, name: 'First Squad' },
        { id: 2, name: 'Second Squad' },
      ],
      isLoading: false,
      isFetching: false,
      isSuccess: true,
    });
    useGetMetricVariablesQuery.mockReturnValue({
      data: [
        {
          source_key: 'kitman|training_session_minutes',
          name: 'Training session minutes',
          source_name: 'kitman',
          type: 'TableMetric',
        },
        {
          source_key: 'kitman:athlete|age_in_years',
          name: 'Age',
          source_name: 'Athlete details',
          type: 'number',
          localised_unit: 'years',
        },
      ],
      isLoading: false,
      isFetching: false,
      isSuccess: true,
    });
  });

  afterEach(() => {
    window.setFlag('table-widget-activity-source', false);
    window.setFlag('table-widget-complex-calculations', false);
    mockDispatch.mockClear();
  });

  it('renders the TableColumnFormulaPanel', async () => {
    renderComponent();

    const formulaPanelTitle = await screen.findByText(
      'Add % baseline change formula'
    );
    expect(formulaPanelTitle).toBeInTheDocument();
  });

  it('renders the formula steps', async () => {
    renderComponent();

    await screen.findByText('Add % baseline change formula');
    expect(screen.getByText('Set baseline')).toBeInTheDocument();
    expect(screen.getByText('Add comparison')).toBeInTheDocument();
    expect(screen.getByText('Add column title')).toBeInTheDocument();
  });

  it('dispatches action on button interaction', async () => {
    const user = userEvent.setup();
    renderComponent();

    await screen.findByText('Add % baseline change formula');
    expect(screen.getByText('Data type')).toBeInTheDocument();
    expect(screen.getByText('Context')).toBeInTheDocument();

    // Name column gets set into state if starts null
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: '% baseline change',
      type: `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/setColumnName`,
    });

    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).toBeEnabled();
    await user.click(nextButton);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: 1,
      type: `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/incrementProgressStep`,
    });

    const backButton = screen.getByRole('button', { name: 'Back' });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toBeEnabled();
    await user.click(backButton);
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: -1,
      type: `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/incrementProgressStep`,
    });

    const closeButton = screen.getAllByRole('button')[0];
    await userEvent.click(closeButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'TOGGLE_TABLE_COLUMN_FORMULA_PANEL',
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/reset`,
    });
  });

  it('calls updateFormulaInputDataSource on changing source', async () => {
    const user = userEvent.setup();
    renderComponent();

    await screen.findByText('Add % baseline change formula');
    mockDispatch.mockClear();
    // clicks on the dropdown select
    await user.click(screen.getByLabelText('Metric Source'));

    // clicks on the metric
    await user.click(screen.getByText('Age (years)'));
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        formulaInputId: 'B',
        properties: {
          key_name: 'kitman:athlete|age_in_years',
          source: 'kitman:athlete',
          type: 'TableMetric',
          variable: 'age_in_years',
        },
      },
      type: `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/updateFormulaInputDataSource`,
    });
  });

  it('calls updateFormulaInput on changing a input A population radio', async () => {
    const user = userEvent.setup();
    renderComponent({
      ...defaultState,
      [COLUMN_FORMULA_PANEL_REDUCER_KEY]: {
        ...COLUMN_FORMULA_PANEL_STATE,
        progressStep: 0,
      },
    });

    await screen.findByText('Add % baseline change formula');

    const populationRadios = screen.getAllByRole('radio');
    expect(populationRadios).toHaveLength(2);
    expect(populationRadios[0]).toBeChecked(); // Select

    await user.click(populationRadios[1]);

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        formulaInputId: 'A',
        properties: {
          population_selection: 'select',
        },
      },
      type: `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/updateFormulaInput`,
    });
  });

  it('calls updateFormulaInput on changing input B population radio', async () => {
    const user = userEvent.setup();
    renderComponent();

    await screen.findByText('Add % baseline change formula');

    const populationRadios = screen.getAllByRole('radio');
    expect(populationRadios).toHaveLength(2);
    expect(populationRadios[1]).toBeChecked(); // Select

    mockDispatch.mockClear();
    await user.click(populationRadios[0]);

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        formulaInputId: 'B',
        properties: {
          population: null,
        },
      },
      type: `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/updateFormulaInput`,
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        formulaInputId: 'B',
        properties: {
          population_selection: 'inherit',
        },
      },
      type: `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/updateFormulaInput`,
    });
  });

  it('calls updateFormulaInput on changing input B Data type', async () => {
    const user = userEvent.setup();
    renderComponent();

    await screen.findByText('Add % baseline change formula');

    await user.click(screen.getByText('Metric'));
    await user.click(screen.getByText('Session activity'));
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        formulaInputId: 'B',
        properties: {
          panel_source: 'activity',
          dataSource: {},
          element_config: initialInput.element_config,
        },
      },
      type: `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/updateFormulaInput`,
    });
  });

  it('calls updateFormulaInput on changing input B time scope', async () => {
    const user = userEvent.setup();
    renderComponent();

    await screen.findByText('Add % baseline change formula');

    await user.click(screen.getByText('This Season So Far'));
    await user.click(screen.getByText('Today'));

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        formulaInputId: 'B',
        properties: {
          time_scope: {
            time_period: 'today',
          },
        },
      },
      type: `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/updateFormulaInput`,
    });
  });

  it('calls updateFormulaInput on changing input B calculation', async () => {
    const user = userEvent.setup();
    renderComponent();

    await screen.findByText('Add % baseline change formula');

    await user.click(screen.getByText('Sum'));
    await user.click(screen.getByText('Min'));

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        formulaInputId: 'B',
        properties: {
          calculation: 'min',
        },
      },
      type: `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/updateFormulaInput`,
    });
  });

  it('calls updateFormulaInputElementConfig on changing input A calculation params', async () => {
    renderComponent({
      ...defaultState,
      [COLUMN_FORMULA_PANEL_REDUCER_KEY]: {
        ...COLUMN_FORMULA_PANEL_STATE,
        inputs: {
          ...COLUMN_FORMULA_PANEL_STATE.inputs,
          A: {
            ...COLUMN_FORMULA_PANEL_STATE.inputs.A,
            calculation: 'z_score',
          },
        },
        progressStep: 0,
      },
    });

    await screen.findByText('Add % baseline change formula');
    expect(screen.getByText('Z-Score')).toBeInTheDocument();
    expect(screen.getByText('Evaluate Period')).toBeInTheDocument();

    const numericInput = screen.getAllByRole('spinbutton')[0];
    await userEvent.type(numericInput, '2');

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        formulaInputId: 'A',
        configKey: 'calculation_params',
        properties: {
          evaluated_period: 2,
        },
      },
      type: `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/updateFormulaInputElementConfig`,
    });
  });

  it('calls onSetColumnName on entering column name', async () => {
    const user = userEvent.setup();
    renderComponent({
      ...defaultState,
      [COLUMN_FORMULA_PANEL_REDUCER_KEY]: {
        ...COLUMN_FORMULA_PANEL_STATE,
        progressStep: 2,
      },
    });

    await screen.findByText('Add % baseline change formula');

    const textField = screen.getByLabelText('Column header title');
    await user.type(textField, 'X');
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: '% baseline changeX',
      type: `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/setColumnName`,
    });
  });

  it('dispatches thunk action on apply button interaction', async () => {
    const user = userEvent.setup();
    renderComponent({
      ...defaultState,
      [COLUMN_FORMULA_PANEL_REDUCER_KEY]: {
        ...COLUMN_FORMULA_PANEL_STATE,
        progressStep: 2,
      },
    });

    await screen.findByText('Add % baseline change formula');

    const applyButton = screen.getByRole('button', { name: 'Apply' });
    expect(applyButton).toBeInTheDocument();
    expect(applyButton).toBeEnabled();
    await user.click(applyButton);
    // Calls thunk for submission
    expect(typeof mockDispatch.mock.lastCall[0]).toEqual('function');
  });

  it('calls updateFormulaInputDataSource with right properties on change data source', async () => {
    const user = userEvent.setup();

    const medicalState = {
      ...defaultState,
      [COLUMN_FORMULA_PANEL_REDUCER_KEY]: {
        ...COLUMN_FORMULA_PANEL_STATE,
        progressStep: 0,
        inputs: {
          A: {
            ...COLUMN_FORMULA_PANEL_STATE.inputs.A,
            panel_source: 'medical',
          },
        },
      },
    };

    renderComponent(medicalState);

    await screen.findByText('Add % baseline change formula');
    await screen.findByText('Injuries');
    const IllnessesButton = await screen.findByText('Illnesses');

    await user.click(IllnessesButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        formulaInputId: 'A',
        properties: {
          type: 'MedicalIllness',
        },
      },
      type: `${COLUMN_FORMULA_PANEL_REDUCER_KEY}/updateFormulaInputDataSource`,
    });
  });
});
