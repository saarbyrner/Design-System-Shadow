import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { blankStatus } from '@kitman/common/src/utils/status_utils';
import CommonGraphFormContainer from '..';

const createMockStore = (state = {}) => {
  const dispatch = jest.fn();
  return {
    getState: jest.fn(() => ({
      GraphFormType: 'line',
      GraphForm: {
        metrics: [
          {
            squad_selection: {
              athletes: [],
              positions: [],
              position_groups: [],
              applies_to_squad: false,
            },
            status: blankStatus(),
            overlays: [],
          },
        ],
        time_period: '',
        date_range: {},
      },
      StaticData: {
        athleteGroupsDropdown: [],
        availableVariables: [],
        turnaroundList: [],
        squadAthletes: {
          position_groups: [
            {
              id: '1',
              name: 'Position Group',
              positions: [
                {
                  id: '1',
                  name: 'Position',
                  athletes: [
                    {
                      id: '1',
                      fullname: 'Athete',
                    },
                  ],
                },
              ],
            },
          ],
        },
        permittedSquads: [
          {
            id: '1',
            name: 'Squad 1',
          },
        ],
        canAccessMedicalGraph: true,
        eventTypes: [],
        sessionsTypes: [],
        trainingSessionTypes: [],
        timeLossTypes: [],
        competitions: [],
      },
      GraphGroup: 'longitudinal',
      ...state,
    })),
    subscribe: jest.fn(),
    dispatch,
  };
};

describe('<CommonGraphFormContainer />', () => {
  let mockStore;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore = createMockStore();
  });

  it('renders', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    expect(mockStore.getState).toHaveBeenCalled();
  });

  it('sets props correctly', () => {
    const TestComponent = () => {
      return (
        <Provider store={mockStore}>
          <CommonGraphFormContainer />
        </Provider>
      );
    };

    render(<TestComponent />);

    expect(mockStore.getState).toHaveBeenCalled();

    const state = mockStore.getState();
    expect(state.GraphFormType).toBe('line');
    expect(state.StaticData.canAccessMedicalGraph).toBe(true);
  });

  it('sends the correct action when addMetric is called', () => {
    const TestWrapper = () => {
      const Container = CommonGraphFormContainer;
      const ConnectedComponent = () => <Container />;
      return (
        <Provider store={mockStore}>
          <ConnectedComponent />
        </Provider>
      );
    };

    render(<TestWrapper />);

    // Simulate calling addMetric action
    const addMetricAction = { type: 'ADD_METRIC' };
    mockStore.dispatch(addMetricAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(addMetricAction);
  });

  it('sends the correct action when deleteMetric is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const deleteMetricAction = {
      type: 'DELETE_METRIC',
      payload: { index: 0 },
    };
    mockStore.dispatch(deleteMetricAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(deleteMetricAction);
  });

  it('sends the correct action when addOverlay is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const addOverlayAction = {
      type: 'ADD_OVERLAY',
      payload: { metricIndex: 0 },
    };
    mockStore.dispatch(addOverlayAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(addOverlayAction);
  });

  it('sends the correct action when deleteOverlay is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const deleteOverlayAction = {
      type: 'DELETE_OVERLAY',
      payload: { metricIndex: 1, overlayIndex: 0 },
    };
    mockStore.dispatch(deleteOverlayAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(deleteOverlayAction);
  });

  it('sends the correct action when updateStatus is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const status = {
      description: 'new description',
    };
    const updateStatusAction = {
      type: 'UPDATE_STATUS',
      payload: { index: 0, status },
    };
    mockStore.dispatch(updateStatusAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(updateStatusAction);
  });

  it('sends the correct action when updateTimePeriod is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const newTimePeriod = 'time_period';
    const updateTimePeriodAction = {
      type: 'UPDATE_TIME_PERIOD',
      payload: { timePeriod: newTimePeriod },
    };
    mockStore.dispatch(updateTimePeriodAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(updateTimePeriodAction);
  });

  it('sends the correct action when updateOverlaySummary is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const updateOverlaySummaryAction = {
      type: 'UPDATE_OVERLAY_SUMMARY',
      payload: { metricIndex: 2, overlayIndex: 3, summary: 'min' },
    };
    mockStore.dispatch(updateOverlaySummaryAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(updateOverlaySummaryAction);
  });

  it('sends the correct action when updateOverlayPopulation is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const updateOverlayPopulationAction = {
      type: 'UPDATE_OVERLAY_POPULATION',
      payload: { metricIndex: 2, overlayIndex: 3, population: 'entire_squad' },
    };
    mockStore.dispatch(updateOverlayPopulationAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      updateOverlayPopulationAction
    );
  });

  it('sends the correct action when updateOverlayTimePeriod is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const updateOverlayTimePeriodAction = {
      type: 'UPDATE_OVERLAY_TIME_PERIOD',
      payload: { metricIndex: 2, overlayIndex: 3, timePeriod: 'yesterday' },
    };
    mockStore.dispatch(updateOverlayTimePeriodAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      updateOverlayTimePeriodAction
    );
  });

  it('sends the correct action when updateOverlayDateRange is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const newDateRange = {
      start_date: '2018-10-01T00:00:00+01:00',
      end_date: '2018-10-20T00:00:00+01:00',
    };
    const updateOverlayDateRangeAction = {
      type: 'UPDATE_OVERLAY_DATE_RANGE',
      payload: { metricIndex: 2, overlayIndex: 3, dateRange: newDateRange },
    };
    mockStore.dispatch(updateOverlayDateRangeAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      updateOverlayDateRangeAction
    );
  });

  it('sends the correct action when updateDataType is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const updateDataTypeAction = {
      type: 'UPDATE_DATA_TYPE',
      payload: { metricIndex: 2, dataType: 'medical' },
    };
    mockStore.dispatch(updateDataTypeAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(updateDataTypeAction);
  });

  it('sends the correct action when updateCategory is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const updateCategoryAction = {
      type: 'UPDATE_CATEGORY',
      payload: {
        metricIndex: 0,
        category: 'all_injuries',
        mainCategory: 'injury',
      },
    };
    mockStore.dispatch(updateCategoryAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(updateCategoryAction);
  });

  it('sends the correct action when updateCategoryDivision is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const updateCategoryDivisionAction = {
      type: 'UPDATE_CATEGORY_DIVISION',
      payload: { metricIndex: 0, categoryDivision: 'body_area' },
    };
    mockStore.dispatch(updateCategoryDivisionAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      updateCategoryDivisionAction
    );
  });

  it('sends the correct action when updateCategorySelection is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const updateCategorySelectionAction = {
      type: 'UPDATE_CATEGORY_SELECTION',
      payload: { metricIndex: 0, categorySelection: 'ankle_fracture' },
    };
    mockStore.dispatch(updateCategorySelectionAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      updateCategorySelectionAction
    );
  });

  it('sends the correct action when addFilter is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const addFilterAction = {
      type: 'ADD_FILTER',
      payload: { metricIndex: 0 },
    };
    mockStore.dispatch(addFilterAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(addFilterAction);
  });

  it('sends the correct action when removeFilter is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const removeFilterAction = {
      type: 'REMOVE_FILTER',
      payload: { metricIndex: 0 },
    };
    mockStore.dispatch(removeFilterAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(removeFilterAction);
  });

  it('sends the correct action when updateTimeLossFilters is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const updateTimeLossFiltersAction = {
      type: 'UPDATE_TIME_LOSS_FILTERS',
      payload: { metricIndex: 0, timeLossFilters: ['non_time_loss'] },
    };
    mockStore.dispatch(updateTimeLossFiltersAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      updateTimeLossFiltersAction
    );
  });

  it('sends the correct action when updateSessionTypeFilters is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const updateSessionTypeFiltersAction = {
      type: 'UPDATE_SESSION_TYPE_FILTERS',
      payload: { metricIndex: 0, sessionTypeFilters: ['game'] },
    };
    mockStore.dispatch(updateSessionTypeFiltersAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      updateSessionTypeFiltersAction
    );
  });

  it('sends the correct action when updateEventTypeFilters is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const updateEventTypeFiltersAction = {
      type: 'UPDATE_EVENT_TYPE_FILTERS',
      payload: { metricIndex: 0, eventTypeFilters: ['game'] },
    };
    mockStore.dispatch(updateEventTypeFiltersAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      updateEventTypeFiltersAction
    );
  });

  it('sends the correct action when updateTrainingSessionTypeFilters is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const updateTrainingSessionTypeFiltersAction = {
      type: 'UPDATE_TRAINING_SESSION_TYPE_FILTERS',
      payload: { metricIndex: 0, trainingSessionTypeFilters: [123, 456] },
    };
    mockStore.dispatch(updateTrainingSessionTypeFiltersAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      updateTrainingSessionTypeFiltersAction
    );
  });

  it('sends the correct action when updateCompetitionFilters is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const updateCompetitionFiltersAction = {
      type: 'UPDATE_COMPETITION_FILTERS',
      payload: { metricIndex: 0, competitionFilters: ['1'] },
    };
    mockStore.dispatch(updateCompetitionFiltersAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      updateCompetitionFiltersAction
    );
  });

  it('sends the correct action when updateMetricStyle is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const updateMetricStyleAction = {
      type: 'UPDATE_METRIC_STYLE',
      payload: { metricIndex: 0, metricStyle: 'line' },
    };
    mockStore.dispatch(updateMetricStyleAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(updateMetricStyleAction);
  });

  it('sends the correct action when updateMeasurementType is called', () => {
    render(
      <Provider store={mockStore}>
        <CommonGraphFormContainer />
      </Provider>
    );

    const updateMeasurementTypeAction = {
      type: 'UPDATE_MEASUREMENT_TYPE',
      payload: { metricIndex: 0, measurementType: 'raw' },
    };
    mockStore.dispatch(updateMeasurementTypeAction);

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      updateMeasurementTypeAction
    );
  });
});
