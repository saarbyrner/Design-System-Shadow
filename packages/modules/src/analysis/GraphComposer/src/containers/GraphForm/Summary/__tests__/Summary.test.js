import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import FormSummaryContainer from '..';

const athletesDropdown = [
  {
    id: 'athlete_1',
    title: 'athlete 1',
  },
  {
    id: 'athlete_2',
    title: 'athlete 2',
  },
  {
    id: 'position_3',
    title: 'position 3',
  },
  {
    id: 'position_group_4',
    title: 'position group 4',
  },
];

const preloadedState = {
  GraphFormSummary: {
    scale_type: 'normalized',
    metrics: [
      {
        status: {},
        source_key: 'test_metric',
      },
    ],
    population: [
      {
        athletes: 'athlete_1',
        calculation: 'sum',
        timePeriod: 'today',
      },
    ],
    comparisonGroupIndex: 4,
  },
  StaticData: {
    athletesDropdown,
    availableVariables: [
      {
        id: 'variable1',
        title: 'variable 1',
      },
    ],
    turnaroundList: ['turnaround1', 'turnaround2'],
    eventTypes: [],
    trainingSessionTypes: [],
  },
};

describe('FormSummaryContainer Container', () => {
  it('renders', () => {
    renderWithRedux(<FormSummaryContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(screen.getByText('Metric Data')).toBeInTheDocument();
  });

  it('sets props correctly', () => {
    renderWithRedux(<FormSummaryContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    expect(screen.getByText('Metric Data')).toBeInTheDocument();
    expect(screen.getByText('Population')).toBeInTheDocument();
    expect(screen.getByText('Build Graph')).toBeInTheDocument();
  });

  it('sends the correct action when addPopulation is called', async () => {
    const user = userEvent.setup();
    const { mockedStore } = renderWithRedux(<FormSummaryContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    const addPopulationButton = screen.getByText(
      '#sport_specific__Add_Athletes'
    );
    await user.click(addPopulationButton);

    const actions = mockedStore.dispatch.mock.calls;
    const addPopulationAction = actions.find(
      (call) => call[0].type === 'formSummary/ADD_POPULATION'
    );

    expect(addPopulationAction[0].type).toBe('formSummary/ADD_POPULATION');
  });

  it('sends the correct action when updateScaleType is called', () => {
    const { mockedStore } = renderWithRedux(<FormSummaryContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    const action = {
      type: 'formSummary/UPDATE_SCALE_TYPE',
      payload: {
        scaleType: 'denormalized',
      },
    };

    mockedStore.dispatch(action);

    const actions = mockedStore.dispatch.mock.calls;
    const lastAction = actions[actions.length - 1][0];

    expect(lastAction.type).toBe('formSummary/UPDATE_SCALE_TYPE');
    expect(lastAction.payload.scaleType).toBe('denormalized');
  });

  it('sends the correct action when deletePopulation is called', () => {
    const { mockedStore } = renderWithRedux(<FormSummaryContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    const populationIndex = 3;
    const action = {
      type: 'formSummary/DELETE_POPULATION',
      payload: {
        index: populationIndex,
      },
    };

    mockedStore.dispatch(action);

    const actions = mockedStore.dispatch.mock.calls;
    const lastAction = actions[actions.length - 1][0];

    expect(lastAction.type).toBe('formSummary/DELETE_POPULATION');
    expect(lastAction.payload.index).toBe(populationIndex);
  });

  it('sends the correct action when addMetrics is called', () => {
    const { mockedStore } = renderWithRedux(<FormSummaryContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    const addedMetrics = ['metric1', 'metric2'];
    const action = {
      type: 'formSummary/ADD_METRICS',
      payload: {
        addedMetrics,
      },
    };

    mockedStore.dispatch(action);

    const actions = mockedStore.dispatch.mock.calls;
    const lastAction = actions[actions.length - 1][0];

    expect(lastAction.type).toBe('formSummary/ADD_METRICS');
    expect(lastAction.payload.addedMetrics).toStrictEqual(addedMetrics);
  });

  it('sends the correct action when removeMetrics is called', () => {
    const { mockedStore } = renderWithRedux(<FormSummaryContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    const removedMetrics = ['metric1', 'metric2'];
    const expectedAction = {
      type: 'formSummary/REMOVE_METRICS',
      payload: {
        removedMetrics,
      },
    };

    mockedStore.dispatch(expectedAction);

    const actions = mockedStore.dispatch.mock.calls;
    const lastAction = actions[actions.length - 1][0];

    expect(lastAction.type).toBe('formSummary/REMOVE_METRICS');
    expect(lastAction.payload.removedMetrics).toStrictEqual(removedMetrics);
  });

  it('sends the correct action when updateAthletes is called', () => {
    const { mockedStore } = renderWithRedux(<FormSummaryContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    const populationIndex = 3;
    const athletesId = 'athlete_1';
    const action = {
      type: 'formSummary/UPDATE_ATHLETES',
      payload: {
        populationIndex,
        athletesId,
      },
    };

    mockedStore.dispatch(action);

    const actions = mockedStore.dispatch.mock.calls;
    const lastAction = actions[actions.length - 1][0];

    expect(lastAction.type).toBe('formSummary/UPDATE_ATHLETES');
    expect(lastAction.payload.populationIndex).toBe(populationIndex);
    expect(lastAction.payload.athletesId).toBe(athletesId);
  });

  it('sends the correct action when updateCalculation is called', () => {
    const { mockedStore } = renderWithRedux(<FormSummaryContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    const populationIndex = 3;
    const calculationId = 'sum';
    const action = {
      type: 'formSummary/UPDATE_CALCULATION',
      payload: {
        populationIndex,
        calculationId,
      },
    };

    mockedStore.dispatch(action);

    const actions = mockedStore.dispatch.mock.calls;
    const lastAction = actions[actions.length - 1][0];

    expect(lastAction.type).toBe('formSummary/UPDATE_CALCULATION');
    expect(lastAction.payload.populationIndex).toBe(populationIndex);
    expect(lastAction.payload.calculationId).toBe(calculationId);
  });

  it('sends the correct action when updateDateRange is called', () => {
    const { mockedStore } = renderWithRedux(<FormSummaryContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    const populationIndex = 3;
    const dateRange = {
      start_date: 'today',
      end_date: 'tomorrow',
    };
    const action = {
      type: 'formSummary/UPDATE_DATE_RANGE',
      payload: {
        populationIndex,
        dateRange,
      },
    };

    mockedStore.dispatch(action);

    const actions = mockedStore.dispatch.mock.calls;
    const lastAction = actions[actions.length - 1][0];

    expect(lastAction.type).toBe('formSummary/UPDATE_DATE_RANGE');
    expect(lastAction.payload.populationIndex).toBe(populationIndex);
    expect(lastAction.payload.dateRange).toStrictEqual(dateRange);
  });

  it('sends the correct action when updateComparisonGroup is called', () => {
    const { mockedStore } = renderWithRedux(<FormSummaryContainer />, {
      preloadedState,
      useGlobalStore: false,
    });

    const populationIndex = 3;
    const action = {
      type: 'formSummary/UPDATE_COMPARISON_GROUP',
      payload: {
        populationIndex,
      },
    };

    mockedStore.dispatch(action);

    const actions = mockedStore.dispatch.mock.calls;
    const lastAction = actions[actions.length - 1][0];

    expect(lastAction.type).toBe('formSummary/UPDATE_COMPARISON_GROUP');
    expect(lastAction.payload.populationIndex).toBe(populationIndex);
  });
});
